import { Category } from "./categories";

export interface Topic {
    id: string;
    title: string;
    slug: string;
    position: number;
    description: string;
    category_id: string;
    category: Category
    meta_title: string;
    meta_description: string;
    created_by_id: string;
    image_id: string;
    status: string;
    is_deleted: boolean;
    createdAt: string;
    updatedAt: string;
}