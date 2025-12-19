"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

/**
 * Framer Motion 재사용 Variants
 * DRY 원칙에 따라 애니메이션 설정을 중앙 관리
 */

// Cubic bezier easing - "as const"로 튜플 타입 보장
const cubicEase = [0.22, 1, 0.36, 1] as const;

/** 아래에서 위로 페이드인 */
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: cubicEase }
    },
};

/** 왼쪽에서 페이드인 */
export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: cubicEase }
    },
};

/** 자식 요소 순차 등장 - 부모 컨테이너에 적용 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

/** 호버 시 확대 효과 */
export const scaleOnHover: Variants = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
    },
};

/** 부드러운 페이드인 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.5 }
    },
};

/** 리스트 아이템 stagger용 */
export const listItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: cubicEase
        },
    },
};

/**
 * AnimatedSection - 스크롤 시 등장하는 섹션 래퍼
 */
interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function AnimatedSection({
    children,
    className = "",
    delay = 0
}: AnimatedSectionProps) {
    return (
        <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.8,
                        delay,
                        ease: cubicEase
                    }
                },
            }}
            className={className}
        >
            {children}
        </motion.section>
    );
}
