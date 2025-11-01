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
      <div className="flex-1">
        <div className="container mx-auto px-6 pb-6">
          <ProductList3D products={products} className="h-[calc(100vh-112px)]" />
        </div>
      </div>
    </main>
  )
}
