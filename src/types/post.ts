import { TFileDocument } from "./global";

export interface Post {
    id: string;
    head_line?: string;
    short_head?: string;
    slug?: string;
    category_id?: string;
    serial_number?: number;
    file_type?: "custom" | "youtube" | "facebook";
    type?: "video" | "photo";
    url?: string;
    file_id?: string;
    file?: TFileDocument;
    thumbnail?: TFileDocument;
}
