'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCollections } from '@/lib/api'
import type { Collection } from '@/types'

const fallback: Array<{ title: string; handle: string; image: string; desc: string }> = [
  { title: "Men's Collection", handle: 'men', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80', desc: 'Timeless styles for every occasion' },
  { title: "Women's Collection", handle: 'women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', desc: 'Elegant & modern essentials' },
  { title: 'Accessories', handle: 'accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80', desc: 'Complete your look' },
  { title: 'New Arrivals', handle: 'new-arrivals', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', desc: 'Fresh styles, just in' },
  { title: 'Sale', handle: 'sale', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', desc: 'Up to 50% off selected items' },
  { title: 'Summer 2024', handle: 'summer-2024', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', desc: 'Light fabrics for warm days' },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollections()
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch(() => setCollections([]))
      .finally(() => setLoading(false))
  }, [])

  const items = collections.length > 0
    ? collections.map((c, i) => ({
        title: c.title,
        handle: c.handle,
        image: c.image || fallback[i % fallback.length]?.image || '',
        desc: c.description || '',
      }))
    : fallback

  return (
    <>
      {/* Page hero */}
      <div className="m-page-hero">
        <div className="m-container">
          <nav style={{ fontSize: 13, color: '#999', marginBottom: 12 }}>
            <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#000' }}>Collections</span>
          </nav>
          <h1 style={{ fontSize: 32, fontWeight: 600, margin: 0 }}>All Collections</h1>
        </div>
      </div>

      {/* Grid */}
      <section className="m-section">
        <div className="m-container">
          {loading ? (
            <div className="m-grid-3" style={{ gap: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ aspectRatio: '4/3', background: '#f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : (
            <div className="m-grid-3" style={{ gap: 20 }}>
              {items.map((item) => (
                <Link
                  key={item.handle}
                  href={`/collections/${item.handle}`}
                  className="m-collection-card"
                  style={{ display: 'block', position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: '#f5f5f5', textDecoration: 'none' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="m-collection-card__img"
                    style={{ position: 'absolute', inset: 0 }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px 24px' }}>
                    <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.2 }}>{item.title}</h2>
                    {item.desc && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: 0 }}>{item.desc}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
