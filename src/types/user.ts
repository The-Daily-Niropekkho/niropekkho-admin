import { TFileDocument } from "./global";

export interface User {
    id: string;
    userUniqueId: string;
    email: string;
    password: string;
    user_type: string;
    username: string;
    is_deleted: boolean;
    is_email_verified: boolean;
    is_online: boolean;
    is_change_password: boolean;
    is_main_account: boolean;
    verification_status: string;
    status: string;
    account_type: string;
    secret_key: string;
    createdAt: string;
    updatedAt: string;
    last_login: string;
    author_id: string;
    department_id: string;
    admin: Admin;
    writer: Writer;
    moderator: Moderator;
}

export interface Admin {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    date_of_birth: string;
    gender: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    profile_image_id: string;
    profile_image: TFileDocument;
}
export interface Writer {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    date_of_birth: string;
    gender: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    profile_image_id: string;
    profile_image: TFileDocument;
}
export interface Moderator {
    id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    nick_name: string;
    date_of_birth: string;
    gender: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    profile_image_id: string;
    profile_image: TFileDocument;
}