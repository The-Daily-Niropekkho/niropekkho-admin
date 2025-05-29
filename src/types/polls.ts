import { TFileDocument } from "./global";

export interface Poll {
    id: string;
    title: string;
    description: string;
    slug: string;
    status: string;
    schedule_at: string;
    banner_image_id: string;
    is_deleted: boolean;
    is_active: string;
    reference: string;
    createdAt: string;
    updatedAt: string;
    banner_image: TFileDocument;
    options: PollOption[];
}

export type PollStatus = "publish" | "draft" | "archived";

export interface PollOption {
    id: string;
    poll_id: string;
    label: string;
    is_deleted: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}
