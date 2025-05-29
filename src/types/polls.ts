import { TFileDocument } from "./global";

export interface Poll {
    id: string;
    title: string;
    description: string;
    slug: string;
    status: PollStatus;
    options: PollOption[];
    banner_image: TFileDocument | undefined;
}

export type PollStatus = "publish" | "draft" | "archived";

export interface PollOption {
    label: string;
}
