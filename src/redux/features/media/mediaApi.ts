/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";
import { TFileDocument, TResponseRedux } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import axios, { AxiosProgressEvent } from "axios";
import Resizer from "react-image-file-resizer";

// Utility function to resize images
const resizeImage = (file: File): Promise<File> => {
    return new Promise<File>((resolve) => {
        Resizer.imageFileResizer(
            file,
            1900,
            1500,
            "JPEG",
            100,
            0,
            (uri) => {
                const compressedImage = new File([uri as BlobPart], file.name, {
                    type: file.type,
                    lastModified: file.lastModified,
                });
                resolve(compressedImage);
            },
            "file"
        );
    });
};

// Utility function to handle single file upload to S3
const singleFileUploaderInS3 = async (
    fileData: {
        pre_url: string;
        fileUniqueId: string;
        mimetype: string;
        filename: string;
    },
    uploadFile: File,
    updateFileProgress: (progress: number, filename: string) => void
) => {
    try {
        let resizedImageFile: File = uploadFile;

        if (
            fileData.mimetype.includes("image") &&
            uploadFile.size > 5 * 1024 * 1024
        ) {
            resizedImageFile = await resizeImage(uploadFile);
        }

        await axios({
            url: fileData.pre_url,
            method: "PUT",
            data: resizedImageFile,
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    updateFileProgress(percentCompleted, fileData.filename);
                }
            },
        });

        return fileData;
    } catch (error: any) {
        throw new Error(error?.message || "Error uploading file");
    }
};

// RTK Query API
export const mediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get all media items
        getMedia: builder.query<TFileDocument[], void>({
            query: () => ({
                url: `/aws/get-moderator-users`,
                method: "GET",
            }),
            transformResponse: (response: TResponseRedux<TFileDocument[]>) => {
                return response.data || [];
            },
            providesTags: [{ type: "Media", id: "LIST" }],
        }),

        // Upload multiple files
        uploadMedia: builder.mutation({
            query: ({ files, setFileProgressList }) => ({
                url: "/aws/create-aws-upload-files-token",
                method: "POST",
                body: {
                    files: files.map((file: File) => ({
                        filename: file.name,
                        mimetype: file.type,
                    })),
                },
                credentials: "include",
            }),
            async onQueryStarted(
                { files, setFileProgressList },
                { dispatch, queryFulfilled }
            ) {
                try {
                    const { data } = await queryFulfilled;
                    const serverResponseObjects = data?.files || [];

                    const updateFileProgress = (
                        progress: number,
                        filename: string
                    ) => {
                        setFileProgressList((prev: any) =>
                            prev.map((item: any) => {
                                if (item.name === filename) {
                                    return {
                                        ...item,
                                        progress,
                                        status:
                                            progress === 100
                                                ? "done"
                                                : "uploading",
                                        url:
                                            progress === 100
                                                ? fileObjectToLink(
                                                      serverResponseObjects.find(
                                                          (f: any) =>
                                                              f.filename ===
                                                              filename
                                                      )
                                                  )
                                                : item.url,
                                    };
                                }
                                return item;
                            })
                        );
                    };

                    const uploadPromises = files.map((file: File) => {
                        const serverObject = serverResponseObjects.find(
                            (serverFile: { filename: string }) =>
                                serverFile.filename === file.name
                        );
                        if (serverObject) {
                            return singleFileUploaderInS3(
                                serverObject,
                                file,
                                updateFileProgress
                            );
                        }
                        console.warn(
                            `No pre-signed URL for file: ${file.name}`
                        );
                        return Promise.resolve(null); // Skip this file
                    });

                    const results = (await Promise.all(uploadPromises)).filter(
                        (result) => result !== null
                    );
                    if (results.length > 0) {
                        dispatch(
                            mediaApi.util.updateQueryData(
                                "getMedia",
                                undefined,
                                (draft) => {
                                    draft.push(...results);
                                }
                            )
                        );
                    }
                } catch (error: any) {
                    console.log(error);

                    throw new Error(error?.message || "Error uploading files");
                }
            },
            invalidatesTags: [{ type: "Media", id: "LIST" }],
        }),
    }),
});

// Export hooks
export const { useGetMediaQuery, useUploadMediaMutation } = mediaApi;
