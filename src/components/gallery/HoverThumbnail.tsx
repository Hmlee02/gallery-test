"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HoverThumbnailProps } from "@/types/artwork";

/**
 * HoverThumbnail 컴포넌트
 * 마우스 위치를 따라다니는 플로팅 이미지
 * - JIII Atelier 스타일 영감
 * - Spring 물리 기반 부드러운 애니메이션
 */
export function HoverThumbnail({
    imageSrc,
    isVisible,
    mousePosition,
}: HoverThumbnailProps) {
    return (
        <motion.div
            className="fixed pointer-events-none z-30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
                x: mousePosition.x + 20,
                y: mousePosition.y - 100,
            }}
            transition={{
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
                x: { type: "spring", stiffness: 150, damping: 15 },
                y: { type: "spring", stiffness: 150, damping: 15 },
            }}
        >
            <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-2xl">
                <Image
                    src={imageSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="256px"
                    priority={false}
                />
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
        </motion.div>
    );
}
