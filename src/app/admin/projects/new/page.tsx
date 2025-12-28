"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function NewProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        category: "",
        year: new Date().getFullYear().toString(),
        description: "",
        thumbnail: "",
    });
    const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);

    // 제목에서 자동으로 slug 생성
    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, ""),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            // 썸네일이 없으면 첫 번째 이미지 사용
            const thumbnail = formData.thumbnail || images[0]?.url || "";

            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    thumbnail,
                    images,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create project");
            }

            router.push("/admin/projects");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-4xl">
            <div className="mb-8">
                <h1 className="font-serif text-3xl md:text-4xl mb-2">New Project</h1>
                <p className="text-muted-foreground">
                    Add a new project to your portfolio
                </p>
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
                            onChange={(e) => handleTitleChange(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="Project Title"
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
                            placeholder="project-slug"
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
                            placeholder="Branding, Web Design, etc."
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
                        placeholder="Describe the project..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Thumbnail URL (optional)
                    </label>
                    <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) =>
                            setFormData({ ...formData, thumbnail: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="https://... or leave empty to use first image"
                    />
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
                        {isSubmitting ? "Creating..." : "Create Project"}
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
