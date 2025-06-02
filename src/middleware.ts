import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { decrypt, DecryptedSession } from "./lib/session";

const roleRouteAccess: Record<string, string[]> = {
  admin: ["*"],
  moderator: [
    "/dashboard",
    "/dashboard/news",
    "/dashboard/posts",
    "/dashboard/media",
    "/dashboard/categories",
    "/dashboard/sub-categories",
    "/dashboard/topics",
    "/dashboard/polls",
    "/dashboard/epaper",
  ],
  writer: [
    "/dashboard",
    "/dashboard/news",
    "/dashboard/posts",
    "/dashboard/media",
    "/dashboard/categories",
    "/dashboard/sub-categories",
    "/dashboard/topics",
    "/dashboard/polls",
    "/dashboard/epaper",
  ],
};

function isAccessAllowed(role: string, pathname: string): boolean {
  const allowedRoutes = roleRouteAccess[role];
  if (!allowedRoutes) return false;
  if (allowedRoutes.includes("*")) return true;
  return allowedRoutes.some(route => pathname.startsWith(route));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookie = req.cookies.get("session")?.value;

  let session: DecryptedSession | null = null;

  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (error) {
      console.log("Token decode error:", error);
    }
  }

  // ✅ Session না থাকলে
  if (!session?.userId) {
    if (pathname.startsWith("/auth")) {
      return NextResponse.next();
    }
    const loginUrl = new URL(`/auth/signin?redirect=${pathname}`, req.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.delete("session");
    return res;
  }

  // ✅ Logged-in user যদি /auth route-এ যায়, রিডাইরেক্ট to home
  if (session?.userId && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Role-based Access Check
  const userRole = session?.user_type;
  if (userRole && !isAccessAllowed(userRole, pathname)) {
    return NextResponse.redirect(new URL("/403", req.url)); // Forbidden page
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
