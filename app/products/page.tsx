import ProductList3D from '@/components/ProductList3D'
import { allProducts } from '@/lib/products'

export default function ProductsIndexPage() {
  const products = allProducts()
  return (
    <main className="min-h-screen flex flex-col">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold">Products</h1>
        <p className="text-muted-foreground">Explore the collection in 3D.</p>
      </div>
      <div className="flex-1 w-full">
        <ProductList3D products={products} className="w-full h-full rounded-none" />
      </div>
    </main>
  )
}
