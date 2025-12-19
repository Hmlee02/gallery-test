"use client";

import { cn } from "@/lib/utils";

/**
 * SkipLink 컴포넌트
 * 키보드 사용자가 반복되는 네비게이션을 건너뛰고 
 * 메인 콘텐츠로 바로 이동할 수 있게 해주는 접근성 필수 요소
 */
export function SkipLink() {
    const handleSkipToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const main = document.getElementById("main-content");
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <a
            href="#main-content"
            onClick={handleSkipToMain}
            className={cn(
                "sr-only focus:not-sr-only",
                "focus:fixed focus:top-4 focus:left-4 focus:z-[100]",
                "focus:px-4 focus:py-2 focus:rounded-md",
                "focus:bg-foreground focus:text-background",
                "focus:outline-none focus:ring-2 focus:ring-accent",
                "font-medium text-sm"
            )}
        >
            Skip to main content
        </a>
    );
}
