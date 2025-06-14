import { Category } from "./categories";
import { TFileDocument } from "./global";
import { GenericReporter } from "./reporter";
import { Topic } from "./topic";
import { User } from "./user";

export interface News {
    id: string;
    category: Category;
    category_id: string;
    banner_image: TFileDocument & {
        caption_title: string;
        thumb_image_size: { width: number; height: number };
        large_image_size: { width: number; height: number };
    };
    allHomeDataNews: allHomeSerial[];
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
    topics: Topic[];
    allTopics: Topic[];
    meta_title: string;
    meta_description: string;
    canonical_url: string;
    og_title: string;
    og_description: string;
    og_image: TFileDocument;
    twitter_card: string;
    schema_markup: string;
    country_id: number;
    division_id: number;
    district_id: number;
    upazilla_id: number;
    union_id: number;
    is_scheduled: boolean;
    is_breaking: boolean;
    is_top_breaking_news: boolean;
    is_featured: boolean;
    status: string;
    is_deleted: boolean;
    generic_reporter_id: string;
    reporter: User;
    breaking_news: BreakingNews;
    generic_reporter: GenericReporter;
    reporter_id: string;
    created_by_id: string;
    createdAt: string;
    updatedAt: string;
}

export interface BreakingNews {
    id: string;
    news_id: string;
    serial_number: number;
    serial_update_at: string;
    is_top_breaking_news: boolean;
    top_serial_number: number;
    top_serial_update_at: string;
    created_by_id: string;
    is_deleted: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    news: News;
}

export interface TopNews {
    id: string;
    news_id: string;
    total_share: number;
    total_like: number;
    total_comment: number;
    total_view: number;
    news: News;
}

export interface allHomeSerial {
    serial_number: number;
    type: "category" | "top_home";
}
