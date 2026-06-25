'use client'

import { Truck, Shield, RotateCcw, Headphones } from 'lucide-react'
import Link from 'next/link'
import HeroBanner from '@/components/home/HeroBanner'
import CollectionsGrid from '@/components/home/CollectionsGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BestSellers from '@/components/home/BestSellers'
import BrandLogos from '@/components/home/BrandLogos'
import Newsletter from '@/components/home/Newsletter'
import Testimonials from '@/components/home/Testimonials'
import { useGetFeaturedProductsQuery, useGetFeaturedCollectionsQuery } from '@/store/api/frontendApi'

const trustBadges = [
  { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'On orders over $75' },
  { icon: <Shield size={24} />, title: 'Secure Payment', desc: '100% protected' },
  { icon: <RotateCcw size={24} />, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Always here for you' },
]

export default function HomePage() {
  const { data: products = [] } = useGetFeaturedProductsQuery()
  const { data: collections = [] } = useGetFeaturedCollectionsQuery()

  return (
    <>
      <HeroBanner />

      {/* Trust badges */}
      <div style={{ borderTop: '1px solid #e8e8e8', borderBottom: '1px solid #e8e8e8', padding: '32px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <div className="m-grid-4" style={{ gap: 24 }}>
            {trustBadges.map((badge, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10 }}>
                <div style={{ color: '#000', marginBottom: 2 }}>{badge.icon}</div>
                <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{badge.title}</p>
                <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CollectionsGrid collections={collections} />
      <FeaturedProducts products={products} />

      {/* Promo banner */}
      <div style={{ background: '#111', padding: '72px 32px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: '#666', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20 }}>Limited Time Offer</p>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
          Summer Sale — Up to 50% Off
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, marginBottom: 32 }}>Don&apos;t miss out on the best deals of the season.</p>
        <Link
          href="/collections/sale"
          style={{ display: 'inline-block', background: '#fff', color: '#000', padding: '14px 36px', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none', transition: 'background 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e8e8e8')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
        >
          Shop the Collection →
        </Link>
      </div>

      <BestSellers products={products} />
      <Testimonials />
      <BrandLogos />
      <Newsletter />
    </>
  )
}
