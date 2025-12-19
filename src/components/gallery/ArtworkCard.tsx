"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArtworkCardProps } from "@/types/artwork";
import { HoverThumbnail } from "./HoverThumbnail";
import { cn } from "@/lib/utils";
import { listItem } from "@/components/animation/variants";

/**
 * ArtworkCard 컴포넌트
 * - 작품 정보 표시 (제목, 카테고리, 연도)
 * - 호버 시 HoverThumbnail 활성화
 * - 마우스 위치 추적
 */
export function ArtworkCard({ artwork, index }: ArtworkCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    // 인덱스 포맷팅 (01, 02, 03...)
    const formattedIndex = String(index + 1).padStart(2, "0");

    return (
        <>
            <motion.article
                variants={listItem}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                <Link
                    href={`/works/${artwork.id}`}
                    className={cn(
                        "group block py-8 border-b border-border/50",
                        "transition-colors hover:bg-secondary/30"
                    )}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    aria-label={`View ${artwork.title} project`}
                >
                    <div className="px-6 md:px-12 flex items-center justify-between gap-4">
                        {/* 왼쪽: 인덱스 + 제목 */}
                        <div className="flex items-baseline gap-6">
                            <span className="font-mono text-sm text-muted-foreground">
                                {formattedIndex}
                            </span>
                            <h2
                                className={cn(
                                    "font-serif text-2xl md:text-4xl",
                                    "group-hover:text-accent transition-colors duration-300"
                                )}
                            >
                                {artwork.title}
                            </h2>
                        </div>

                        {/* 오른쪽: 카테고리 + 연도 */}
                        <div className="hidden sm:flex items-center gap-6">
                            <span className="text-sm text-muted-foreground">
                                {artwork.category}
                            </span>
                            <span className="font-mono text-sm text-muted-foreground">
                                {artwork.year}
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.article>

            {/* 호버 썸네일 - Portal처럼 동작 */}
            <HoverThumbnail
                imageSrc={artwork.thumbnail}
                isVisible={isHovered}
                mousePosition={mousePosition}
            />
        </>
    );
}
