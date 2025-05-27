/* eslint-disable import/no-anonymous-default-export */
export default {
    host:
        process.env.NODE_ENV === "production"
            ? process.env.BASE_URL_PROD
            : process.env.BASE_URL,
    host_aws:
        process.env.NODE_ENV === "production"
            ? process.env.AWS_BASE_URL_PROD
            : process.env.AWS_BASE_URL,
    host_front:
        process.env.NODE_ENV === "production"
            ? process.env.FRONT_BASE_URL_PROD
            : process.env.FRONT_BASE_URL,
    aws_cdn_url: process.env.AWS_CDN,
    google_client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};
