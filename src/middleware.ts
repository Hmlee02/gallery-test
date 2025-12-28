import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    // API 라우트는 개별적으로 보호
    if (isApiRoute) {
        return NextResponse.next();
    }

    // 관리자 페이지 접근 시
    if (isAdminRoute) {
        // 로그인 페이지는 허용
        if (isLoginPage) {
            // 이미 로그인되어 있으면 대시보드로 리다이렉트
            if (isLoggedIn) {
                return NextResponse.redirect(new URL("/admin", req.url));
            }
            return NextResponse.next();
        }

        // 로그인 안 되어 있으면 로그인 페이지로
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*"],
};
