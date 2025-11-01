export type Product = {
  slug: string
  title: string
  price: number
  image: string
  description: string
  specs?: Record<string, string>
  tags?: string[]
  inStock?: boolean
}

const currency = (value: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value)

export const PRODUCTS: Product[] = [
  {
    slug: '1',
    title: 'Aurora Canvas Print',
    price: 49,
    image: '/1.webp',
    description:
      'High‑resolution canvas print inspired by the first gallery image. Matte finish with vibrant color reproduction.',
    specs: {
      Material: 'Premium cotton canvas',
      Size: '40 × 30 cm',
      Frame: 'Optional (black / oak)',
    },
    tags: ['canvas', 'wall-art', 'limited'],
    inStock: true,
  },
  {
    slug: '2',
    title: 'Noir Photo Poster',
    price: 29,
    image: '/2.webp',
    description: 'Museum‑grade photo poster with deep blacks and crisp detail.',
    specs: { Paper: '200 gsm matte', Size: 'A2' },
    tags: ['poster', 'photo'],
    inStock: true,
  },
  {
    slug: '3',
    title: 'Sunlit Print',
    price: 39,
    image: '/3.webp',
    description: 'Archival print capturing warm highlights and soft gradients.',
    specs: { Paper: 'Luster', Size: '30 × 40 cm' },
    tags: ['print'],
  },
  { slug: '4', title: 'Minimal Study', price: 35, image: '/4.webp', description: 'Minimal composition print.', tags: ['minimal'] },
  { slug: '5', title: 'Urban Geometry', price: 45, image: '/5.webp', description: 'Geometric urban landscape print.', tags: ['architecture'] },
  { slug: '6', title: 'Pastel Flow', price: 32, image: '/6.webp', description: 'Soft pastel colorway poster.', tags: ['pastel', 'poster'] },
  { slug: '7', title: 'Coastal Breeze', price: 42, image: '/7.webp', description: 'Coastal themed fine‑art print.', tags: ['nature'] },
  { slug: '8', title: 'Night Drive', price: 38, image: '/8.webp', description: 'Moody, cinematic night scene.', tags: ['cinematic'] },
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
