/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
        path: "/_next/image",
        loader: "default",
        minimumCacheTTL: 31536000,
        dangerouslyAllowSVG: true,
    },
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        BASE_URL_PROD: process.env.NEXT_PUBLIC_BASE_URL_PROD,
        AWS_BASE_URL: process.env.AWS_BASE_URL,
        AWS_BASE_URL_PROD: process.env.AWS_BASE_URL_PROD,
        AWS_CDN: process.env.AWS_CDN_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
};

export default nextConfig;
