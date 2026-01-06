import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProjectList from "@/components/admin/ProjectList";

type ProjectWithImages = {
    id: string;
    slug: string;
    title: string;
    category: string;
    year: number;
    thumbnail: string | null;
    description: string | null;
    published: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    images: { id: string; url: string; alt: string | null; order: number; projectId: string }[];
};

export default async function AdminProjectsPage() {
    const projects: ProjectWithImages[] = await prisma.project.findMany({
        include: { images: true },
        orderBy: { order: "asc" },
    });

    return (
        <div className="p-6 md:p-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl mb-2">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage your portfolio projects
                    </p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    + New Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border/50 rounded-lg">
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Link
                        href="/admin/projects/new"
                        className="text-accent hover:underline"
                    >
                        Create your first project →
                    </Link>
                </div>
            ) : (
                <ProjectList initialProjects={projects} />
            )}
        </div>
    );
}
