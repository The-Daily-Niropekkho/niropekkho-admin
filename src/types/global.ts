import { BaseQueryApi } from "@reduxjs/toolkit/query";

export type TError = {
    data: {
        message: string;
        stack: string;
        errorMessage: {
            path: string;
            message: string;
        };
        success: boolean;
    };
    status: number;
};

export type TMeta = {
    limit: number;
    page: number;
    total: number;
    totalPage: number;
};

export type TResponse<T> = {
    data?: T;
    error?: TError;
    meta?: TMeta;
    success: boolean;
    message: string;
    statusCode?: number;
};

export type TResponseRedux<T> = TResponse<T> & BaseQueryApi;

export type TQueryParam = {
    name: string;
    value: boolean | React.Key;
};

export interface ErrorSource {
    path: string;
    message: string;
}

export interface ErrorResponseData {
    status: boolean;
    message: string;
    errorSources: ErrorSource[];
    stack?: string;
}

export interface ErrorResponse {
    data: ErrorResponseData;
    status: boolean;
}

export type IImagePlatform = "imgbb" | "cloudinary" | "server" | "aws" | string;
export const I_IMAGE_PLATFORM_ARRAY = ["imgbb", "cloudinary", "server", "aws"];

export interface TFileDocument {
    id: string;
    mimetype: string;
    server_url?: string;
    filename?: string;
    originalUrl?: string;
    pre_url?: string;
    modifyFileName?: string;
    path?: string;
    url: string;
    durl?: string;
    fileUniqueId?: string;
    platform: IImagePlatform;
    fileType: string;
    cdn?: string;
    size: number;
    createdAt: string;
    updatedAt: string;
    caption_title: string;
    thumb_image_size: ThumbImageSize;
    large_image_size: LargeImageSize;
}

export interface ThumbImageSize {
  width: number
  height: number
}

export interface LargeImageSize {
  width: number
  height: number
}
