"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface ImageUploaderProps {
    images: { url: string; alt?: string }[];
    onImagesChange: (images: { url: string; alt?: string }[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setUploading(true);
            try {
                const uploadPromises = acceptedFiles.map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);

                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                    });

                    if (!res.ok) {
                        throw new Error("Upload failed");
                    }

                    const data = await res.json();
                    return { url: data.url, alt: file.name };
                });

                const newImages = await Promise.all(uploadPromises);
                onImagesChange([...images, ...newImages]);
            } catch (error) {
                console.error("Upload error:", error);
                alert("Failed to upload some images");
            } finally {
                setUploading(false);
            }
        },
        [images, onImagesChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
        },
        multiple: true,
    });

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {/* 업로드 영역 */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
                        ? "border-accent bg-accent/10"
                        : "border-border/50 hover:border-accent/50"
                    }`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <p className="text-muted-foreground">Uploading...</p>
                ) : isDragActive ? (
                    <p className="text-accent">Drop the images here...</p>
                ) : (
                    <div>
                        <p className="text-muted-foreground mb-2">
                            Drag & drop images here, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF, WebP (max 10MB each)
                        </p>
                    </div>
                )}
            </div>

            {/* 이미지 미리보기 */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square relative rounded-lg overflow-hidden bg-secondary/50">
                                <Image
                                    src={image.url}
                                    alt={image.alt || ""}
                                    fill
                                    className="object-cover"
                                    sizes="200px"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
                            >
                                ×
                            </button>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {image.alt || `Image ${index + 1}`}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
