"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP 플러그인 등록
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * useSmoothScroll 훅
 * GSAP ScrollTrigger 기반 스무스 스크롤 및 패럴랙스 효과
 */
export function useSmoothScroll() {
    useEffect(() => {
        // 스무스 스크롤 효과 (CSS scroll-behavior로도 처리 가능)
        const smoothScroll = gsap.to(window, {
            scrollTo: { y: 0 },
            duration: 0,
            paused: true,
        });

        return () => {
            smoothScroll.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);
}

/**
 * useParallax 훅
 * 요소에 패럴랙스 효과 적용
 */
export function useParallax(speed: number = 0.5) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const tween = gsap.to(element, {
            yPercent: speed * 100,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            tween.kill();
        };
    }, [speed]);

    return elementRef;
}

/**
 * useScrollReveal 훅
 * 스크롤 시 요소 등장 애니메이션
 */
export function useScrollReveal() {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        gsap.set(element, { opacity: 0, y: 50 });

        const tween = gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });

        return () => {
            tween.kill();
        };
    }, []);

    return elementRef;
}

/**
 * useTextSplit 훅
 * 텍스트를 글자별로 분리하여 stagger 애니메이션
 */
export function useTextSplit() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const chars = container.querySelectorAll(".char");
        if (chars.length === 0) return;

        gsap.set(chars, { opacity: 0, y: 30 });

        const tween = gsap.to(chars, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.03,
            ease: "power3.out",
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });

        return () => {
            tween.kill();
        };
    }, []);

    return containerRef;
}
