import Image from 'next/image'
import Link from 'next/link'

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  // For demo: map slug to image in public folder by index or name
  // Expect slugs like "1", "2", or file names without extension
  const imgSrc = `/${slug}.webp`

  return (
    <main className="min-h-screen container mx-auto p-6">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/">← Back to gallery</Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-black/5">
          {/* Using next/image is optional; falls back to public file */}
          <Image src={imgSrc} alt={`Product ${slug}`} fill className="object-cover" />
        </div>

        <section>
          <h1 className="text-3xl font-semibold mb-3">Product {slug}</h1>
          <p className="text-muted-foreground mb-6">
            This is a placeholder product page for item {slug}. Replace with real data
            and connect to your commerce backend.
          </p>

          <div className="space-y-2">
            <div className="text-lg">$49.00</div>
            <button className="px-4 py-2 rounded-md bg-black text-white">Add to cart</button>
          </div>
        </section>
      </div>
    </main>
  )
}
