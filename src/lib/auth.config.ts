import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth configuration (no Prisma/Node.js dependencies)
export const authConfig = {
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminRoute = nextUrl.pathname.startsWith("/admin");
            const isLoginPage = nextUrl.pathname === "/admin/login";

            if (isAdminRoute) {
                if (isLoginPage) {
                    // 이미 로그인되어 있으면 대시보드로 리다이렉트
                    if (isLoggedIn) {
                        return Response.redirect(new URL("/admin", nextUrl));
                    }
                    return true;
                }
                // 로그인 안 되어 있으면 로그인 페이지로
                if (!isLoggedIn) {
                    return false; // NextAuth가 자동으로 signIn 페이지로 리다이렉트
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Providers are added in auth.ts
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
