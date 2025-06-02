/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import config from "@/config";
import { instance as axiosInstance } from "@/helpers/axios/axiosInstance";
import type { TFileDocument } from "@/types";
import { getStringUrl } from "@/utils/getStringUrl";
import axios, { type AxiosProgressEvent } from "axios";
import { useState } from "react";
import Resizer from "react-image-file-resizer";
// Import the helper function
// import { getStringUrl } from "@/utils/getStringUrl"

interface FileProgress {
    name: string;
    progress: number;
    status: "pending" | "uploading" | "done" | "error";
    url?:
        | string
        | {
              cdn?: string;
              path?: string;
              url?: string;
              originalUrl?: string;
              server_url?: string;
          };
}

export function useFileUpload() {
    const [fileProgressList, setFileProgressList] = useState<FileProgress[]>(
        []
    );
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Update the uploadFiles function
    const uploadFiles = async (files: File[]): Promise<TFileDocument[]> => {
        if (!files.length) return [];

        setIsUploading(true);
        setUploadError(null);

        // Initialize progress tracking for each file
        const initialProgress = files.map((file) => ({
            name: file.name,
            progress: 0,
            status: "pending" as const,
        }));

        setFileProgressList(initialProgress);

        try {
            const result = await FilProgressMultipleFilesUploaderS3(
                files,
                setFileProgressList
            );

            // Extract the URL strings from the result objects
            const urls = result.map((file) => getStringUrl(file));

            setUploadedUrls(urls);
            setIsUploading(false);
            return result
        } catch (error: any) {
            setUploadError(error?.message || "Failed to upload files");
            setIsUploading(false);
            return [];
        }
    };

    // Helper function to get S3 pre-signed URL
    const getS3PreUrlToken = async (
        data: Record<
            string,
            { filename: string; mimetype: string; fileUniqueId?: string }[]
        >
    ) => {
        try {
            const url = `${config.host_aws}/api/v1/aws/create-aws-upload-files-token`;
            const response = await axiosInstance.post(url, data, {
                withCredentials: true,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(
                error?.response?.data?.message || error.message || "Error"
            );
        }
    };

    // Single file uploader function
    const singleFileUploaderInS3 = async (
        fileData: {
            pre_url: any;
            fileUniqueId: string;
            mimetype: string;
            filename: string;
        },
        uploadFile: File,
        setFileProgressList: React.Dispatch<
            React.SetStateAction<FileProgress[]>
        >
    ) => {
        // Update the updateFileProgress function
        const updateFileProgress = (progress: number) => {
            setFileProgressList((prev) =>
                prev.map((item) => {
                    if (item.name === fileData.filename) {
                        return {
                            ...item,
                            progress,
                            status: progress === 100 ? "done" : "uploading",
                            url:
                                progress === 100
                                    ? getStringUrl(fileData)
                                    : undefined,
                        };
                    } else {
                        return item;
                    }
                })
            );
        };
        try {
            let resizedImageFile: File;

            // Resize image if needed
            if (
                fileData.mimetype.includes("image") &&
                uploadFile.size > 5 * 1024 * 1024
            ) {
                resizedImageFile = await resizeImage(uploadFile);
            } else {
                resizedImageFile = uploadFile;
            }

            // Upload to S3
            await axios({
                url: fileData.pre_url,
                method: "PUT",
                data: resizedImageFile,
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

    // Helper function to resize images
    const resizeImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
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

    // Main upload function
    const FilProgressMultipleFilesUploaderS3 = async (
        files: File[],
        setFileProgressList: React.Dispatch<
            React.SetStateAction<FileProgress[]>
        >
    ): Promise<TFileDocument[]> => {
        if (!files.length) {
            return [];
        }

        try {
            const filesModifyServerFormate = files.map((file) => {
                return {
                    filename: file.name,
                    mimetype: file.type,
                };
            });

            // Get pre-signed URLs
            const getFilesToken = await getS3PreUrlToken({
                files: filesModifyServerFormate,
            });

            const serverResponseObjects = getFilesToken?.files || [];
            const promises: Promise<any>[] = [];

            files.forEach((file) => {
                const serverObject = serverResponseObjects?.find(
                    (serverFile: { filename: string }) =>
                        serverFile?.filename === file?.name
                );

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

    return {
        uploadFiles,
        fileProgressList,
        isUploading,
        uploadedUrls,
        uploadError,
    };
}
