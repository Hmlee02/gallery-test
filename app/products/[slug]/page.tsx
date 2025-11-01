import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, formatPrice } from '@/lib/products'
import { notFound } from 'next/navigation'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return notFound()

  return (
    <main className="min-h-screen container mx-auto p-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/">← Back to gallery</Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-black/5">
          <Image src={product.image} alt={product.title} fill className="object-cover" />
        </div>

        <section>
          <h1 className="text-3xl font-semibold mb-2">{product.title}</h1>
          <div className="text-sm text-muted-foreground mb-2">SKU: {product.sku}</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-xl">{formatPrice(product.price)}</div>
            {product.rating && (
              <div className="text-sm text-muted-foreground">★ {product.rating.value.toFixed(1)} ({product.rating.count})</div>
            )}
            {typeof product.stock === 'number' && (
              <span className={`text-xs px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          {product.specs && (
            <div className="mb-6">
              <h2 className="font-medium mb-2">Specifications</h2>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                {Object.entries(product.specs).map(([k, v]) => (
                  <li key={k}><span className="font-medium">{k}:</span> {v}</li>
                ))}
              </ul>
            </div>
          )}

          {product.tags && (
            <div className="mb-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {product.tags.map((t) => (
                <span key={t} className="px-2 py-1 rounded bg-black/5 dark:bg-white/10">#{t}</span>
              ))}
            </div>
          )}

          {product.shipping && (
            <div className="mb-6 text-sm text-muted-foreground space-y-1">
              <div><span className="font-medium text-foreground">Shipping:</span> {product.shipping.delivery ?? '—'}</div>
              {product.shipping.from && <div>Ships from: {product.shipping.from}</div>}
              {product.shipping.weight && <div>Weight: {product.shipping.weight}</div>}
              {product.shipping.returns && <div>Returns: {product.shipping.returns}</div>}
            </div>
          )}

          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-md bg-black text-white">Add to cart</button>
            <button className="px-4 py-2 rounded-md border">Buy now</button>
          </div>
        </section>
      </div>
    </main>
  )
}
