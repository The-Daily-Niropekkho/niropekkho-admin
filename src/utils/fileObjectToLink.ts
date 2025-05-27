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
            "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-10615.jpg";
    }
    return imageSrc as string;
}
