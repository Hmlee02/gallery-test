import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
    // 통계 데이터 가져오기
    const [projectCount, publishedCount, imageCount] = await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { published: true } }),
        prisma.image.count(),
    ]);

    return (
        <div className="p-6 md:p-12">
            <div className="mb-8">
                <h1 className="font-serif text-3xl md:text-4xl mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your gallery admin panel
                </p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-secondary/30 border border-border/50 rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Projects</p>
                    <p className="font-serif text-4xl">{projectCount}</p>
                </div>
                <div className="bg-secondary/30 border border-border/50 rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">Published</p>
                    <p className="font-serif text-4xl">{publishedCount}</p>
                </div>
                <div className="bg-secondary/30 border border-border/50 rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Images</p>
                    <p className="font-serif text-4xl">{imageCount}</p>
                </div>
            </div>

            {/* 빠른 작업 */}
            <div className="mb-8">
                <h2 className="font-serif text-xl mb-4">Quick Actions</h2>
                <div className="flex gap-4">
                    <Link
                        href="/admin/projects/new"
                        className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                        + New Project
                    </Link>
                    <Link
                        href="/admin/projects"
                        className="px-6 py-3 bg-secondary/50 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                    >
                        Manage Projects
                    </Link>
                </div>
            </div>
        </div>
    );
}
