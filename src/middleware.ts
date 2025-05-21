import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decrypt, DecryptedSession } from "./lib/session";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const cookie = req.cookies.get("session")?.value;
    const isChangePassword = req.cookies.get("is_change_password")?.value;

    let session: DecryptedSession | null = null;

    if (cookie) {
        try {
            session = await decrypt(cookie);
        } catch (error) {
            console.log("Token decode error:", error);
        }
    }

    // যদি সেশন না থাকে বা userId না থাকে
    if (!session?.userId) {
        // /auth রাউটে থাকলে পাস করুন
        if (pathname.startsWith("/auth")) {
            return NextResponse.next();
        }
        return await handleRefreshOrLogout(req, pathname);
    }

    if (isChangePassword === "true" && pathname !== "/auth/set-password") {
        const url = req.nextUrl.clone();
        url.pathname = "/set-password";
        return NextResponse.redirect(url);
    }

    // সেশন থাকলে এবং /auth রাউটে থাকলে হোমে রিডাইরেক্ট
    if (session?.userId && pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
}

async function handleRefreshOrLogout(req: NextRequest, pathname: string) {
    try {
        const refreshResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
            {
                method: "POST",
                credentials: "include", // refreshToken কুকি পাঠানোর জন্য
            }
        );

        if (!refreshResponse.ok) {
            if (refreshResponse.status === 401) {
                // রিফ্রেশ টোকেন অবৈধ, লগআউট করুন
                return await logoutAndRedirect(req, pathname);
            }
            throw new Error("Refresh token failed");
        }

        const { accessToken } = await refreshResponse.json();
        const res = NextResponse.next();

        // নতুন অ্যাক্সেস টোকেন কুকিতে সেট করুন
        res.cookies.set("session", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 15 * 60 * 1000, // 15 মিনিট
        });

        return res;
    } catch (error) {
        console.log("Refresh error:", error);
        return await logoutAndRedirect(req, pathname);
    }
}

async function logoutAndRedirect(req: NextRequest, pathname: string) {
    // ব্যাকএন্ডে লগআউট এন্ডপয়েন্ট কল
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch (error) {
        console.log("Logout error:", error);
    }

    // কুকি ক্লিয়ার করুন
    const res = NextResponse.redirect(
        new URL(`/auth/signin?redirect=${pathname}`, req.url)
    );
    res.cookies.delete("session");
    res.cookies.delete("refreshToken");

    return res;
}

export const config = {
    // matcher: [],
    matcher: ["/dashboard/:path*", "/auth/:path*"],
};
