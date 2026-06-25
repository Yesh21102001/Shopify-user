'use client'

import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products.length) return null

  return (
    <section className="m-section" style={{ background: '#fff', borderTop: '1px solid #f0f0f0' }}>
      <div className="m-container">
        <div className="m-section-heading">
          <div>
            <span className="m-section-heading__subtitle">Just In</span>
            <h2 className="m-section-heading__title">New Arrivals</h2>
          </div>
          <Link href="/products" className="m-section-heading__link">View All</Link>
        </div>

        {products.length > 4 ? (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            breakpoints={{
              0:    { slidesPerView: 2 },
              640:  { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="m-product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
