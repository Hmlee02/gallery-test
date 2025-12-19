"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/types/artwork";
import { cn } from "@/lib/utils";

const NAV_LINKS: NavLink[] = [
    { label: "Works", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

/**
 * Header 컴포넌트
 * - 로고와 네비게이션 링크 제공
 * - 모바일: 햄버거 메뉴 → 풀스크린 오버레이
 * - 스크롤 시 배경 블러 효과
 * - 접근성: ESC 키 닫기, 포커스 트랩
 */
export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);

    const handleMenuToggle = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
        // 메뉴 닫힐 때 버튼으로 포커스 복귀
        menuButtonRef.current?.focus();
    };

    // ESC 키로 메뉴 닫기
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMenuOpen) {
                handleMenuClose();
            }
        };

        if (isMenuOpen) {
            document.addEventListener("keydown", handleEscape);
            // 메뉴 열릴 때 body 스크롤 방지
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    // 포커스 트랩: Tab 키로 메뉴 내에서만 순환
    useEffect(() => {
        if (!isMenuOpen || !menuRef.current) return;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            const focusableElements = menuRef.current!.querySelectorAll(
                'a[href], button:not([disabled])'
            );
            const firstEl = focusableElements[0] as HTMLElement;
            const lastEl = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault();
                lastEl?.focus();
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault();
                firstEl?.focus();
            }
        };

        document.addEventListener("keydown", handleTab);
        // 첫 번째 링크에 포커스
        const firstLink = menuRef.current.querySelector("a") as HTMLElement;
        firstLink?.focus();

        return () => document.removeEventListener("keydown", handleTab);
    }, [isMenuOpen]);

    return (
        <>
            <header
                role="banner"
                className={cn(
                    "fixed top-0 left-0 right-0 z-50",
                    "flex items-center justify-between",
                    "px-6 md:px-12 py-4",
                    "bg-background/80 backdrop-blur-md",
                    "border-b border-border/50"
                )}
            >
                {/* 로고 */}
                <Link
                    href="/"
                    className="font-serif text-2xl tracking-tight hover:opacity-70 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded"
                    aria-label="Aura Gallery Home"
                >
                    Aura
                </Link>

                {/* 데스크톱 네비게이션 */}
                <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium",
                                "hover:text-accent transition-colors",
                                "relative after:absolute after:bottom-0 after:left-0",
                                "after:h-px after:w-0 after:bg-accent",
                                "hover:after:w-full after:transition-all after:duration-300",
                                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* 모바일 메뉴 버튼 */}
                <button
                    ref={menuButtonRef}
                    className="md:hidden p-2 -mr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
                    onClick={handleMenuToggle}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-haspopup="dialog"
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between" aria-hidden="true">
                        <motion.span
                            className="block h-0.5 w-full bg-foreground origin-center"
                            animate={isMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.span
                            className="block h-0.5 w-full bg-foreground"
                            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="block h-0.5 w-full bg-foreground origin-center"
                            animate={isMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </button>
            </header>

            {/* 모바일 풀스크린 메뉴 */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        ref={menuRef}
                        id="mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Navigation menu"
                        className={cn(
                            "fixed inset-0 z-40",
                            "bg-background/95 backdrop-blur-lg",
                            "flex flex-col items-center justify-center",
                            "md:hidden"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* 닫기 버튼 (접근성) */}
                        <button
                            onClick={handleMenuClose}
                            className="absolute top-4 right-6 p-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded"
                            aria-label="Close menu"
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
                            {NAV_LINKS.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="font-serif text-4xl hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded"
                                        onClick={handleMenuClose}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
