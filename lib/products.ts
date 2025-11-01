export type Product = {
  slug: string
  title: string
  price: number
  image: string
  images?: string[]
  sku: string
  category?: string
  description: string
  specs?: Record<string, string>
  tags?: string[]
  stock?: number
  dimensions?: { width: number; height: number; unit?: 'cm' | 'in' }
  materials?: string[]
  rating?: { value: number; count: number }
  shipping?: { weight?: string; from?: string; delivery?: string; returns?: string }
}

const currency = (value: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)

export const PRODUCTS: Product[] = [
  {
    slug: '1',
    title: 'Aurora Canvas Print',
    price: 49,
    image: '/1.webp',
    images: ['/1.webp'],
    sku: 'AUR-CAN-40x30',
    category: 'Canvas',
    description:
      'High‑resolution canvas print inspired by the first gallery image. Matte finish with vibrant color reproduction.',
    specs: {
      Material: 'Premium cotton canvas',
      Size: '40 × 30 cm',
      Frame: 'Optional (black / oak)',
    },
    tags: ['canvas', 'wall-art', 'limited'],
    stock: 12,
    dimensions: { width: 40, height: 30, unit: 'cm' },
    materials: ['Cotton canvas', 'Pigment inks'],
    rating: { value: 4.7, count: 128 },
    shipping: { weight: '0.8 kg', from: 'Seoul, KR', delivery: '3–5 business days', returns: '30‑day returns' },
  },
  {
    slug: '2',
    title: 'Noir Photo Poster',
    price: 29,
    image: '/2.webp',
    images: ['/2.webp'],
    sku: 'NOI-POS-A2',
    category: 'Poster',
    description: 'Museum‑grade photo poster with deep blacks and crisp detail.',
    specs: { Paper: '200 gsm matte', Size: 'A2' },
    tags: ['poster', 'photo'],
    stock: 30,
    dimensions: { width: 42, height: 59.4, unit: 'cm' },
    materials: ['Matte paper'],
    rating: { value: 4.5, count: 86 },
    shipping: { weight: '0.2 kg', from: 'Seoul, KR', delivery: '2–4 business days' },
  },
  {
    slug: '3',
    title: 'Sunlit Print',
    price: 39,
    image: '/3.webp',
    images: ['/3.webp'],
    sku: 'SUN-PRT-30x40',
    category: 'Print',
    description: 'Archival print capturing warm highlights and soft gradients.',
    specs: { Paper: 'Luster', Size: '30 × 40 cm' },
    tags: ['print'],
    stock: 8,
    dimensions: { width: 30, height: 40, unit: 'cm' },
    materials: ['Luster paper', 'Archival ink'],
    rating: { value: 4.6, count: 64 },
  },
  {
    slug: '4',
    title: 'Minimal Study',
    price: 35,
    image: '/4.webp',
    images: ['/4.webp'],
    sku: 'MIN-PRT-30x40',
    category: 'Print',
    description: 'Minimal composition print.',
    tags: ['minimal'],
    stock: 20,
    rating: { value: 4.2, count: 21 },
  },
  {
    slug: '5',
    title: 'Urban Geometry',
    price: 45,
    image: '/5.webp',
    images: ['/5.webp'],
    sku: 'URB-PRT-40x50',
    category: 'Print',
    description: 'Geometric urban landscape print.',
    tags: ['architecture'],
    stock: 6,
    rating: { value: 4.4, count: 35 },
  },
  {
    slug: '6',
    title: 'Pastel Flow',
    price: 32,
    image: '/6.webp',
    images: ['/6.webp'],
    sku: 'PAS-POS-A3',
    category: 'Poster',
    description: 'Soft pastel colorway poster.',
    tags: ['pastel', 'poster'],
    stock: 0,
    rating: { value: 4.1, count: 18 },
  },
  {
    slug: '7',
    title: 'Coastal Breeze',
    price: 42,
    image: '/7.webp',
    images: ['/7.webp'],
    sku: 'COS-PRT-30x40',
    category: 'Print',
    description: 'Coastal themed fine‑art print.',
    tags: ['nature'],
    stock: 14,
    rating: { value: 4.6, count: 53 },
  },
  {
    slug: '8',
    title: 'Night Drive',
    price: 38,
    image: '/8.webp',
    images: ['/8.webp'],
    sku: 'NGT-PRT-30x40',
    category: 'Print',
    description: 'Moody, cinematic night scene.',
    tags: ['cinematic'],
    stock: 11,
    rating: { value: 4.8, count: 201 },
  },
]

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function allProducts() {
  return PRODUCTS
}

export function formatPrice(value: number) {
  return currency(value)
}
