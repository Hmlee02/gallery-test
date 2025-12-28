"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HoverThumbnailProps } from "@/types/artwork";

// 썸네일 크기 상수
const THUMBNAIL_WIDTH = 256; // w-64 = 16rem = 256px
const THUMBNAIL_HEIGHT = 320; // h-80 = 20rem = 320px
const OFFSET_X = 20; // 마우스로부터의 x 오프셋
const OFFSET_Y = 100; // 마우스로부터의 y 오프셋
const PADDING = 16; // 화면 가장자리 여백

/**
 * HoverThumbnail 컴포넌트
 * 마우스 위치를 따라다니는 플로팅 이미지
 * - JIII Atelier 스타일 영감
 * - Spring 물리 기반 부드러운 애니메이션
 * - 화면 경계 체크로 뷰포트 밖으로 나가지 않음
 */
export function HoverThumbnail({
    imageSrc,
    isVisible,
    mousePosition,
}: HoverThumbnailProps) {
    // 뷰포트 경계를 고려한 위치 계산
    const adjustedPosition = useMemo(() => {
        if (typeof window === "undefined") {
            return { x: mousePosition.x + OFFSET_X, y: mousePosition.y - OFFSET_Y };
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // X 위치 계산: 우측 경계 체크
        let x = mousePosition.x + OFFSET_X;
        if (x + THUMBNAIL_WIDTH + PADDING > viewportWidth) {
            // 우측 경계 초과 시 마우스 왼쪽에 표시
            x = mousePosition.x - THUMBNAIL_WIDTH - OFFSET_X;
        }
        // 좌측 경계 체크
        if (x < PADDING) {
            x = PADDING;
        }

        // Y 위치 계산: 상단 경계 체크
        let y = mousePosition.y - OFFSET_Y;
        if (y < PADDING) {
            // 상단 경계 초과 시 마우스 아래쪽에 표시
            y = mousePosition.y + OFFSET_X;
        }
        // 하단 경계 체크
        if (y + THUMBNAIL_HEIGHT + PADDING > viewportHeight) {
            y = viewportHeight - THUMBNAIL_HEIGHT - PADDING;
        }

        return { x, y };
    }, [mousePosition.x, mousePosition.y]);

    return (
        <motion.div
            className="fixed pointer-events-none z-30"
            style={{
                top: 0,
                left: 0,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.8,
                x: adjustedPosition.x,
                y: adjustedPosition.y,
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
