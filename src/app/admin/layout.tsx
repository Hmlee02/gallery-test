import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // 로그인 페이지가 아니고 인증 안 되어 있으면 리다이렉트
    // (미들웨어에서 처리하지만 이중 체크)

    return (
        <div className="min-h-screen bg-background">
            {session && (
                <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link href="/admin" className="font-serif text-xl">
                                Aura Admin
                            </Link>
                            <nav className="flex items-center gap-6">
                                <Link
                                    href="/admin"
                                    className="text-sm hover:text-accent transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/projects"
                                    className="text-sm hover:text-accent transition-colors"
                                >
                                    Projects
                                </Link>
                                <Link
                                    href="/"
                                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                                    target="_blank"
                                >
                                    View Site →
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                {session.user?.email}
                            </span>
                            <form
                                action={async () => {
                                    "use server";
                                    await signOut({ redirectTo: "/admin/login" });
                                }}
                            >
                                <button
                                    type="submit"
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </header>
            )}
            <main className={session ? "pt-0" : ""}>{children}</main>
        </div>
    );
}
