"use client";

import { motion } from "framer-motion";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { artworkList } from "@/data/artworks";
import { fadeInUp, staggerContainer } from "@/components/animation/variants";

/**
 * 홈페이지
 * - Hero 섹션: 대형 타이틀 + 서브텍스트
 * - Gallery Grid 섹션: 작품 리스트
 */
export default function HomePage() {
  return (
    <>
      {/* Hero 섹션 */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight"
          >
            Crafting visual
            <br />
            <span className="italic">experiences</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            A curated collection of creative works exploring the intersection
            of design, technology, and human emotion.
          </motion.p>
        </motion.div>
      </section>

      {/* Gallery 섹션 */}
      <section className="pb-16">
        <div className="px-6 md:px-12 mb-8">
          <h2 className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
            Selected Works
          </h2>
        </div>
        <GalleryGrid artworkList={artworkList} />
      </section>
    </>
  );
}
