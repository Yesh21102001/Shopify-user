'use client'

import Link from 'next/link'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

interface BestSellersProps {
  products: Product[]
}

export default function BestSellers({ products }: BestSellersProps) {
  if (!products.length) return null

  return (
    <section className="m-section" style={{ background: '#fafafa' }}>
      <div className="m-container">
        <div className="m-section-heading">
          <div>
            <span className="m-section-heading__subtitle">Top Picks</span>
            <h2 className="m-section-heading__title">Best Sellers</h2>
          </div>
          <Link href="/products?sort=best-selling" className="m-section-heading__link">View All</Link>
        </div>

        <div className="m-product-grid">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
