"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    year: number;
    description: string;
    thumbnail: string;
    published: boolean;
    images: { url: string; alt?: string }[];
}

export default function EditProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        year: "",
        description: "",
        thumbnail: "",
        published: true,
    });
    const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);

    // 프로젝트 데이터 로드
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                if (!res.ok) throw new Error("Project not found");

                const project: Project = await res.json();
                setFormData({
                    title: project.title,
                    slug: project.slug,
                    category: project.category,
                    year: project.year.toString(),
                    description: project.description,
                    thumbnail: project.thumbnail,
                    published: project.published,
                });
                setImages(project.images || []);
            } catch {
                setError("Failed to load project");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const thumbnail = formData.thumbnail || images[0]?.url || "";

            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    thumbnail,
                    images,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update project");
            }

            router.push("/admin/projects");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete project");

            router.push("/admin/projects");
            router.refresh();
        } catch {
            setError("Failed to delete project");
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 md:p-12">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-4xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl md:text-4xl mb-2">Edit Project</h1>
                    <p className="text-muted-foreground">Update project details</p>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            required
                            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData({ ...formData, slug: e.target.value })
                            }
                            required
                            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) =>
                                setFormData({ ...formData, category: e.target.value })
                            }
                            required
                            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Year *</label>
                        <input
                            type="number"
                            value={formData.year}
                            onChange={(e) =>
                                setFormData({ ...formData, year: e.target.value })
                            }
                            required
                            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono"
                            min="2000"
                            max="2099"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Description *
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        required
                        rows={4}
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Thumbnail URL
                    </label>
                    <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) =>
                            setFormData({ ...formData, thumbnail: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) =>
                            setFormData({ ...formData, published: e.target.checked })
                        }
                        className="w-5 h-5 rounded border-border"
                    />
                    <label htmlFor="published" className="text-sm font-medium">
                        Published
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Project Images
                    </label>
                    <ImageUploader images={images} onImagesChange={setImages} />
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-3 bg-secondary/50 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
