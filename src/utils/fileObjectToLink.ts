import config from "@/config";
import { TFileDocument } from "@/types";

export default function fileObjectToLink(src: TFileDocument | string | null) {

    let imageSrc;

    if (src && typeof src === "object" && "path" in src) {
        imageSrc = config.aws_cdn_url + "/" + src.path;
    } else if (src && typeof src === "object" && src.originalUrl) {
        imageSrc = src.originalUrl;
    } else if (typeof src === "string") {
        imageSrc = src;
    } else if (src) {
        imageSrc = src;
    } else {
        imageSrc =
            "https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?t=st=1720180742~exp=1720184342~hmac=45367258d48f919941fdf6a910f0fbf3e86f0385c7ad53ec92ecc7b3e7e3c641&w=300";
    }
    return imageSrc as string;
}
