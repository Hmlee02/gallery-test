import { Artwork } from "@/types/artwork";

/**
 * 샘플 갤러리 작품 데이터
 * 실제 프로젝트에서는 CMS 또는 API에서 가져올 수 있음
 */
export const artworkList: Artwork[] = [
    {
        id: "brand-identity-lumina",
        title: "Lumina Brand Identity",
        category: "Branding",
        year: 2024,
        thumbnail: "/images/works/lumina-thumb.jpg",
        images: [
            "/images/works/lumina-01.jpg",
            "/images/works/lumina-02.jpg",
            "/images/works/lumina-03.jpg",
        ],
        description:
            "A refined brand identity for Lumina, a luxury lighting company. The design emphasizes elegance through minimalist typography and a warm color palette.",
    },
    {
        id: "web-design-aether",
        title: "Aether Digital Experience",
        category: "Web Design",
        year: 2024,
        thumbnail: "/images/works/aether-thumb.jpg",
        images: [
            "/images/works/aether-01.jpg",
            "/images/works/aether-02.jpg",
        ],
        description:
            "An immersive digital experience for Aether, showcasing their innovative products through smooth animations and intuitive navigation.",
    },
    {
        id: "editorial-seasons",
        title: "Seasons Editorial",
        category: "Editorial",
        year: 2023,
        thumbnail: "/images/works/seasons-thumb.jpg",
        images: [
            "/images/works/seasons-01.jpg",
            "/images/works/seasons-02.jpg",
            "/images/works/seasons-03.jpg",
            "/images/works/seasons-04.jpg",
        ],
        description:
            "A stunning editorial project capturing the essence of each season through carefully curated photography and thoughtful layout design.",
    },
    {
        id: "packaging-bloom",
        title: "Bloom Cosmetics Packaging",
        category: "Packaging",
        year: 2023,
        thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=750&fit=crop",
        images: [
            "/images/works/bloom-01.jpg",
            "/images/works/bloom-02.jpg",
        ],
        description:
            "Sustainable packaging design for Bloom Cosmetics, featuring organic materials and a nature-inspired visual language.",
    },
    {
        id: "brand-identity-noir",
        title: "Noir Restaurant Identity",
        category: "Branding",
        year: 2023,
        thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=750&fit=crop",
        images: [
            "/images/works/noir-01.jpg",
            "/images/works/noir-02.jpg",
            "/images/works/noir-03.jpg",
        ],
        description:
            "A sophisticated brand identity for Noir, an upscale restaurant. The design combines classic elegance with modern sensibilities.",
    },
    {
        id: "web-design-pulse",
        title: "Pulse Health Platform",
        category: "Web Design",
        year: 2022,
        thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=750&fit=crop",
        images: [
            "/images/works/pulse-01.jpg",
            "/images/works/pulse-02.jpg",
        ],
        description:
            "A comprehensive health platform design focusing on accessibility and user-friendly interfaces for diverse demographics.",
    },
];
