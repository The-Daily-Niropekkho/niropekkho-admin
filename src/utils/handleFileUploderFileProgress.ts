/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";

import config from "@/config";
import { TFileDocument } from "@/types";
import axios, { AxiosProgressEvent } from "axios";
import Resizer from "react-image-file-resizer";
import fileObjectToLink from "./fileObjectToLink";
const url = `${config.host_aws}/api/v1/aws/create-aws-upload-files-token`;
const singleFileUploaderInS3 = async (
    fileData: {
        pre_url: any;
        fileUniqueId: string;
        mimetype: string;
        filename: string;
    },
    uploadFile: any,
    setFileProgressList: any
) => {
    try {
        const updateFileProgress = (progress: number) => {
            setFileProgressList((prev: any) =>
                prev.map(
                    (item: any) => {
                        if (item.name === fileData.filename) {
                            return {
                                ...item,
                                progress,
                                status: progress === 100 ? "done" : "uploading",
                                url:
                                    progress === 100 &&
                                    fileObjectToLink(fileData as any),
                            };
                        } else {
                            return item;
                        }
                    }
                    // item.fileUniqueId === fileData.fileUniqueId
                    //   ? {
                    //       ...item,
                    //       progress,
                    //       status: progress === 100 ? 'done' : 'uploading',
                    //       url: progress === 100 && fileObjectToLink(fileData as any),
                    //     }
                    //   : item,
                )
            );
        };
        let resizedImageFile;
        const resizeImage = (file: File) => {
            return new Promise<File>((resolve) => {
                Resizer.imageFileResizer(
                    file,
                    1900,
                    1500,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        const compressedImage = new File(
                            [uri as BlobPart],
                            file.name,
                            {
                                type: file.type,
                                lastModified: file.lastModified,
                            }
                        );
                        resolve(compressedImage);
                    },
                    "file"
                );
            });
        };
        if (fileData.mimetype.includes("image")) {
            if (uploadFile?.size > 5 * 1024 * 1024) {
                // 2mb up image resize
                resizedImageFile = await resizeImage(uploadFile);
            } else {
                resizedImageFile = uploadFile;
            }
        } else {
            resizedImageFile = uploadFile;
        }

        const response = await axios({
            url: fileData.pre_url,
            method: "PUT",
            data: resizedImageFile,
            //   headers: { 'Content-Type': fileData.mimetype },
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    updateFileProgress(percentCompleted);
                }
            },
        });

        return fileData;
    } catch (error: any) {
        throw new Error(error?.message || "Error");
    }
};
type IPreUrlParams = {
    filename: string;
    mimetype: string;
    fileUniqueId?: string;
};

const getS3PreUrlToken = async (data: Record<string, IPreUrlParams[]>) => {
    try {
        const response = await axiosInstance.post(
            url,
            data, //example {files:[{ filename: string; mimetype: string; fileUniqueId?: string; }]}
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || error.message || "Error"
        );
    }
};
export const FilProgressMultipleFilesUploaderS3 = async (
    files: File[],
    setFileProgressList: any
): Promise<TFileDocument[]> => {
    if (!files.length) {
        return [];
    }
    try {
        const filesModifyServerFormate = files.map((file, index) => {
            return {
                filename: file.name,
                mimetype: file.type,
            };
        });

        //-----------------------get pre-url-----------------------------
        const promises: any[] = [];
        const getFilesToken = await getS3PreUrlToken({
            files: filesModifyServerFormate,
        });
        const serverResponseObjects = getFilesToken?.files || [];

        //----------------------------------------------------------------
        files?.forEach((file) => {
            const serverObject = serverResponseObjects?.find(
                (serverFile: { filename: string }) =>
                    serverFile?.filename === file?.name
            );
            // const mainUploadFile = file?.originFileObj ? file.originFileObj : file;

            const fileUpload = singleFileUploaderInS3(
                serverObject,
                file,
                setFileProgressList
            );
            promises.push(fileUpload);
        });
        const result = await Promise.all(promises);

        return result;
    } catch (error: any) {
        throw new Error(error?.message || "Error");
    }
};
