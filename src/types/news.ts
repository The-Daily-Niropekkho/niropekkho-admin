import { Category } from "./categories";
import { TFileDocument } from "./global";
import { User } from "./user";

export interface News {
    id: string;
    category: Category
    category_id: string;
    banner_image: TFileDocument;
    headline: string;
    short_headline: string;
    slug: string;
    category_serial: number;
    home_serial: number;
    publish_date: string;
    details: string;
    details_html: string;
    media_type: string;
    excerpt: string;
    banner_image_id: string;
    reference: string;
    tags: string[];
    meta_title: string;
    meta_description: string;
    canonical_url: string;
    og_title: string;
    og_description: string;
    og_image: string;
    twitter_card: string;
    schema_markup: string;
    country_id: number;
    division_id: number;
    district_id: number;
    upazilla_id: number;
    union_id: number;
    is_scheduled: boolean;
    is_breaking: boolean;
    is_featured: boolean;
    status: string;
    is_deleted: boolean;
    reporter: User;
    reporter_id: string;
    created_by_id: string;
    createdAt: string;
    updatedAt: string;
}
