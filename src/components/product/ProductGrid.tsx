import ProductCard from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  cols?: 2 | 3 | 4
}

export default function ProductGrid({ products, loading = false, cols = 4 }: ProductGridProps) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[cols]

  if (loading) {
    return (
      <div className={`grid ${gridClass} gap-4 md:gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded aspect-[3/4] w-full" />
            <div className="mt-3 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">No products found.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridClass} gap-4 md:gap-6`}>
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
