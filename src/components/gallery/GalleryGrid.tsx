"use client";

import { GalleryGridProps } from "@/types/artwork";
import { ArtworkCard } from "./ArtworkCard";

/**
 * GalleryGrid 컴포넌트
 * - 세로 리스트 레이아웃 (JIII Atelier 스타일)
 * - 작품 간 구분선
 * - 반응형 디자인
 */
export function GalleryGrid({ artworkList }: GalleryGridProps) {
    if (!artworkList || artworkList.length === 0) {
        return (
            <div className="py-20 text-center text-muted-foreground">
                <p>No artworks to display.</p>
            </div>
        );
    }

    return (
        <section className="pt-4" aria-label="Gallery of works">
            <div className="border-t border-border/50">
                {artworkList.map((artwork, index) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} index={index} />
                ))}
            </div>
        </section>
    );
}
