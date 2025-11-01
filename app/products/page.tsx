import ProductList3D from '@/components/ProductList3D'
import { allProducts } from '@/lib/products'

export default function ProductsIndexPage() {
  const products = allProducts()
  return (
    <main className="min-h-screen container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Products</h1>
        <p className="text-muted-foreground">Explore the collection in 3D.</p>
      </div>
      <ProductList3D products={products} />
    </main>
  )
}
