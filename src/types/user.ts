export interface User {
    id: string;
    userUniqueId: string;
    role_id: string;
    email: string;
    password: string;
    user_type: string;
    username: string;
    is_deleted: boolean;
    is_verified: boolean;
    is_email_verified: boolean;
    is_online: boolean;
    is_change_password: boolean;
    status: string;
    account_type: string;
    secret_key: string;
    createdAt: string;
    updatedAt: string;
    last_login: string;
    author_id: string;
    is_main_account: boolean;
    admin: null;
    b2b: B2b;
    b2c: null;
}

export interface B2b {
    id: string;
    user_id: string;
    firstName: string;
    lastName: string;
    phone: string;
    companyName: string;
    companyAddress: string;
    district: string;
    establishedDate: string;
    tradeLicenseNumber: string;
    nidNumber: string;
    tinNumber: string;
    gender: string;
    address: string;
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
    is_deleted: boolean;
    image: AnyDocumentFile;
    civilAviation: AnyDocumentFile;
    logo: AnyDocumentFile;
    nidBack: AnyDocumentFile;
    nidFront: AnyDocumentFile;
    tinCertificate: AnyDocumentFile;
    tradeLicense: AnyDocumentFile;
}

export interface AnyDocumentFile {
    cdn: string;
    url: string;
    path: string;
    filename: string;
    mimetype: string;
    platform: string;
    originalUrl: string;
    modifyFileName: string;
}