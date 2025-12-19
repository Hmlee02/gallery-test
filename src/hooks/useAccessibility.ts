"use client";

import { useEffect, useCallback } from "react";

/**
 * useFocusTrap 훅
 * 모달이나 메뉴 오버레이에서 포커스가 벗어나지 않도록 가두기
 */
export function useFocusTrap(
    containerRef: React.RefObject<HTMLElement | null>,
    isActive: boolean
) {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isActive || !containerRef.current) return;

            const focusableElements = containerRef.current.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[
                focusableElements.length - 1
            ] as HTMLElement;

            // Tab 키로 순환
            if (e.key === "Tab") {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }

            // Escape로 닫기 (부모 컴포넌트에서 처리해야 함)
        },
        [containerRef, isActive]
    );

    useEffect(() => {
        if (isActive) {
            document.addEventListener("keydown", handleKeyDown);
            // 활성화 시 첫 번째 요소에 포커스
            const container = containerRef.current;
            if (container) {
                const firstFocusable = container.querySelector(
                    'a[href], button:not([disabled])'
                ) as HTMLElement;
                firstFocusable?.focus();
            }
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isActive, handleKeyDown, containerRef]);
}

/**
 * useKeyboardShortcut 훅
 * 특정 키 조합에 대한 핸들러 등록
 */
export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const ctrlMatch = options.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey;
            const shiftMatch = options.shift ? e.shiftKey : !e.shiftKey;
            const altMatch = options.alt ? e.altKey : !e.altKey;

            if (e.key.toLowerCase() === key.toLowerCase() && ctrlMatch && shiftMatch && altMatch) {
                e.preventDefault();
                callback();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [key, callback, options]);
}

/**
 * useAnnounce 훅
 * 스크린 리더에 메시지 전달 (aria-live region)
 */
export function useAnnounce() {
    const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
        const announcer = document.getElementById("sr-announcer");
        if (announcer) {
            announcer.setAttribute("aria-live", priority);
            announcer.textContent = message;
            // 메시지 초기화 (같은 메시지 반복 가능하게)
            setTimeout(() => {
                announcer.textContent = "";
            }, 1000);
        }
    }, []);

    return announce;
}
