"use server";

import { TSession } from "@/types";
import { jwtDecode } from 'jwt-decode';
import { cookies } from "next/headers";
import "server-only";

export interface DecryptedSession {
    userId: string | null;
    user_type: "b2b" | "guest";
    roleBaseUserId: string;
    userUniqueId: string;
    email: string;
    iat: number;
    exp: number;
}

export async function decrypt(session: string | undefined = "") {
    try {
        if (!session) {
            throw new Error("No session token provided");
        }
        const payload = jwtDecode<DecryptedSession>(session);
        // ম্যানুয়ালি টোকেনের মেয়াদ চেক করা
        if (payload.exp * 1000 < Date.now()) {
            throw new Error("Session token expired");
        }
        return payload;
    } catch {
        return null;
    }
}

export async function getSession(): Promise<TSession> {
    const cookie = cookies().get("session")?.value;
    if (cookie) {
        const session = await decrypt(cookie);

        if (session?.userId) {
            return {
                isAuth: true,
                user: {
                    userId: session.userId,
                    roleBaseUserId: session.roleBaseUserId,
                    userUniqueId: session.userUniqueId,
                    email: session.email,
                },
                user_type: session.user_type,
            };
        }
    }

    return { isAuth: false, user: null, user_type: "guest" };
}