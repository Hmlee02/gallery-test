import type { Metadata } from "next";
import { Inter, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/a11y/SkipLink";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aura Gallery | High-End Creative Portfolio",
  description:
    "Aura is a premium gallery showcasing exceptional creative work in branding, web design, and visual identity.",
  keywords: ["gallery", "portfolio", "branding", "web design", "creative"],
  openGraph: {
    title: "Aura Gallery",
    description: "High-End Creative Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${dmSerif.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* 접근성: 스킵 링크 */}
        <SkipLink />

        <Header />

        {/* 메인 콘텐츠 - tabindex로 포커스 가능하게 */}
        <main
          id="main-content"
          className="flex-1 pt-20"
          tabIndex={-1}
        >
          {children}
        </main>

        <Footer />

        {/* 접근성: 스크린 리더 알림 영역 */}
        <div
          id="sr-announcer"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      </body>
    </html>
  );
}
