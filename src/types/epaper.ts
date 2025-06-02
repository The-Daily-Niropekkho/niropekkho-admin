import { TFileDocument } from "./global";

export interface EpaperCategory {
    id: string;
    title: string;
    status: EpaperCategoryStatus;
    createdAt: string;
    updatedAt: string;
}

export enum EpaperCategoryStatus {
    active,
    inactive,
}

export interface EpaperPage {
    id: string;
    category: EpaperCategory;
    publish_date: string;
    edition: string;
    page_number: number;
    image: TFileDocument;
    createdAt: string;
    updatedAt: string;
}
