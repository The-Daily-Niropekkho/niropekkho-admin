/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TFileDocument } from "@/types";
import fileObjectToLink from "@/utils/fileObjectToLink";
import NextImage from "next/image";

type ImageTagProps = {
    src: TFileDocument | string | null;
    width?: number;
    height?: number;
    alt?: string;
    preview?: boolean;
    className?: string;
};

export default function CustomImage({
    src,
    width,
    height,
    alt,
    className,
    ...props
}: ImageTagProps) {

    return (
        <NextImage
            src={fileObjectToLink(src)}
            // @ts-ignore
            alt={alt || src?.filename || "Image"}
            width={width || 750}
            height={height || 750}
            {...props}
            className={className}
        />
    );
}
