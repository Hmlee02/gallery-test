import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Project, Image } from "@prisma/client";

type ProjectWithImages = Project & { images: Image[] };

export default async function AdminProjectsPage() {
    const projects: ProjectWithImages[] = await prisma.project.findMany({
        include: { images: true },
        orderBy: { createdAt: "desc" },
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
                <div className="border border-border/50 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-secondary/30">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium">
                                    Title
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium">
                                    Category
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium">
                                    Year
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium">
                                    Status
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-medium">
                                    Images
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr
                                    key={project.id}
                                    className="border-t border-border/50 hover:bg-secondary/20 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/admin/projects/${project.id}/edit`}
                                            className="font-medium hover:text-accent transition-colors"
                                        >
                                            {project.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {project.category}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">
                                        {project.year}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs rounded-full ${project.published
                                                ? "bg-green-500/20 text-green-500"
                                                : "bg-yellow-500/20 text-yellow-500"
                                                }`}
                                        >
                                            {project.published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {project.images.length}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/projects/${project.id}/edit`}
                                            className="text-sm text-accent hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
