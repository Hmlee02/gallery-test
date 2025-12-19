/**
 * Artwork 인터페이스 - 갤러리 작품 데이터 구조
 */
export interface Artwork {
    /** 고유 식별자 */
    id: string;
    /** 작품 제목 */
    title: string;
    /** 카테고리 (예: "Branding", "Web Design") */
    category: string;
    /** 제작 연도 */
    year: number;
    /** 썸네일 이미지 경로 */
    thumbnail: string;
    /** 상세 페이지 이미지 목록 */
    images: string[];
    /** 작품 설명 */
    description: string;
}

/**
 * 갤러리 그리드 컴포넌트 Props
 */
export interface GalleryGridProps {
    artworkList: Artwork[];
}

/**
 * 작품 카드 컴포넌트 Props
 */
export interface ArtworkCardProps {
    artwork: Artwork;
    index: number;
}

/**
 * 호버 썸네일 컴포넌트 Props
 */
export interface HoverThumbnailProps {
    imageSrc: string;
    isVisible: boolean;
    mousePosition: { x: number; y: number };
}

/**
 * 네비게이션 링크 타입
 */
export interface NavLink {
    label: string;
    href: string;
}
