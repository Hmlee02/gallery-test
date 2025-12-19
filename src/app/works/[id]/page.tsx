"use client";

import { useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { artworkList } from "@/data/artworks";
import { fadeInUp, staggerContainer } from "@/components/animation/variants";
import { cn } from "@/lib/utils";

/**
 * 작품 상세 페이지
 * - 히어로: 작품 제목, 메타정보
 * - 이미지 갤러리 (패럴랙스 효과)
 * - 작품 설명
 * - 이전/다음 작품 네비게이션
 */
export default function WorkDetailPage() {
    const params = useParams();
    const workId = params.id as string;

    // 작품 찾기
    const artworkIndex = artworkList.findIndex((work) => work.id === workId);
    const artwork = artworkList[artworkIndex];

    // 404 처리
    if (!artwork) {
        notFound();
    }

    // 이전/다음 작품
    const prevWork = artworkIndex > 0 ? artworkList[artworkIndex - 1] : null;
    const nextWork =
        artworkIndex < artworkList.length - 1 ? artworkList[artworkIndex + 1] : null;

    // 인덱스 포맷팅
    const formattedIndex = String(artworkIndex + 1).padStart(2, "0");
    const totalWorks = String(artworkList.length).padStart(2, "0");

    // 페이지 진입 시 스크롤 최상단
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [workId]);

    return (
        <article className="min-h-screen">
            {/* 히어로 섹션 */}
            <motion.header
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="px-6 md:px-12 pt-8 pb-16 border-b border-border/50"
            >
                {/* 메타 정보 */}
                <motion.div
                    variants={fadeInUp}
                    className="flex items-center gap-4 text-sm text-muted-foreground mb-8"
                >
                    <span className="font-mono">
                        {formattedIndex} / {totalWorks}
                    </span>
                    <span>•</span>
                    <span>{artwork.category}</span>
                    <span>•</span>
                    <span className="font-mono">{artwork.year}</span>
                </motion.div>

                {/* 작품 제목 */}
                <motion.h1
                    variants={fadeInUp}
                    className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight max-w-4xl"
                >
                    {artwork.title}
                </motion.h1>

                {/* 작품 설명 */}
                <motion.p
                    variants={fadeInUp}
                    className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl"
                >
                    {artwork.description}
                </motion.p>
            </motion.header>

            {/* 이미지 갤러리 */}
            <section className="py-16 md:py-24 space-y-16 md:space-y-24">
                {/* 히어로 이미지 (전폭) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="px-6 md:px-12"
                >
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                        <Image
                            src={artwork.thumbnail}
                            alt={`${artwork.title} - Main visual`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority
                        />
                    </div>
                </motion.div>

                {/* 추가 이미지들 (패럴랙스 그리드) */}
                <div className="px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        {artwork.images.slice(0, 4).map((imageSrc, index) => (
                            <motion.div
                                key={imageSrc}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.15,
                                }}
                                className={cn(
                                    "relative rounded-lg overflow-hidden",
                                    index % 2 === 1 ? "md:mt-16" : "" // 엇갈린 레이아웃
                                )}
                            >
                                <div className="aspect-[4/5]">
                                    <Image
                                        src={imageSrc.startsWith("http") ? imageSrc : artwork.thumbnail}
                                        alt={`${artwork.title} - Detail ${index + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 이전/다음 네비게이션 */}
            <nav
                className="border-t border-border/50"
                aria-label="Work navigation"
            >
                <div className="grid grid-cols-2">
                    {/* 이전 작품 */}
                    <div className="border-r border-border/50">
                        {prevWork ? (
                            <Link
                                href={`/works/${prevWork.id}`}
                                className={cn(
                                    "group block p-6 md:p-12",
                                    "hover:bg-secondary/30 transition-colors"
                                )}
                            >
                                <span className="text-sm text-muted-foreground">Previous</span>
                                <h3 className="mt-2 font-serif text-xl md:text-2xl group-hover:text-accent transition-colors">
                                    {prevWork.title}
                                </h3>
                            </Link>
                        ) : (
                            <div className="p-6 md:p-12 text-muted-foreground">
                                <span className="text-sm">Previous</span>
                                <p className="mt-2 text-xl">—</p>
                            </div>
                        )}
                    </div>

                    {/* 다음 작품 */}
                    <div>
                        {nextWork ? (
                            <Link
                                href={`/works/${nextWork.id}`}
                                className={cn(
                                    "group block p-6 md:p-12 text-right",
                                    "hover:bg-secondary/30 transition-colors"
                                )}
                            >
                                <span className="text-sm text-muted-foreground">Next</span>
                                <h3 className="mt-2 font-serif text-xl md:text-2xl group-hover:text-accent transition-colors">
                                    {nextWork.title}
                                </h3>
                            </Link>
                        ) : (
                            <div className="p-6 md:p-12 text-right text-muted-foreground">
                                <span className="text-sm">Next</span>
                                <p className="mt-2 text-xl">—</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 목록으로 돌아가기 */}
                <div className="border-t border-border/50 p-6 md:p-12 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
                    >
                        ← Back to all works
                    </Link>
                </div>
            </nav>
        </article>
    );
}
