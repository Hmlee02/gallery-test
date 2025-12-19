"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Twitter", href: "https://twitter.com" },
    { label: "Behance", href: "https://behance.net" },
];

/**
 * Footer 컴포넌트
 * - 마키(무한 스크롤) 텍스트 배너
 * - SNS 링크
 * - 저작권 정보
 */
export function Footer() {
    // Hydration 에러 방지: 클라이언트에서만 연도 설정
    const [currentYear, setCurrentYear] = useState(2024);

    useEffect(() => {
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="mt-auto border-t border-border/50">
            {/* 마키 배너 */}
            <div className="overflow-hidden py-8 bg-foreground text-background">
                <div className="animate-marquee whitespace-nowrap flex">
                    {/* 충분한 반복으로 무한 스크롤 효과 */}
                    {[...Array(4)].map((_, i) => (
                        <span key={i} className="mx-8 font-serif text-4xl md:text-5xl">
                            Get in touch ✦ Let&apos;s create together ✦ Say hello ✦
                        </span>
                    ))}
                </div>
            </div>

            {/* 푸터 콘텐츠 */}
            <div
                className={cn(
                    "px-6 md:px-12 py-8",
                    "flex flex-col md:flex-row",
                    "items-center justify-between gap-6"
                )}
            >
                {/* 저작권 */}
                <p className="text-sm text-muted-foreground">
                    © {currentYear} Aura Gallery. All rights reserved.
                </p>

                {/* SNS 링크 */}
                <nav className="flex items-center gap-6" aria-label="Social media links">
                    {SOCIAL_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "text-sm font-medium",
                                "hover:text-accent transition-colors",
                                "underline-offset-4 hover:underline"
                            )}
                            aria-label={`Visit our ${link.label} page (opens in new tab)`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* 페이지 상단으로 */}
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className={cn(
                        "text-sm font-medium",
                        "hover:text-accent transition-colors",
                        "flex items-center gap-2"
                    )}
                    aria-label="Scroll to top of page"
                >
                    Back to top ↑
                </button>
            </div>
        </footer>
    );
}
