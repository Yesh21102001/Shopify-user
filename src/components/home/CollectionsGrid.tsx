import Link from 'next/link'
import type { Collection } from '@/types'

interface CollectionsGridProps {
  collections: Collection[]
}

const placeholders = [
  {
    title: "Men's Collection",
    handle: 'men',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80',
    subtitle: '120+ Styles',
  },
  {
    title: "Women's Collection",
    handle: 'women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    subtitle: '200+ Styles',
  },
  {
    title: 'Accessories',
    handle: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    subtitle: '80+ Styles',
  },
]

export default function CollectionsGrid({ collections }: CollectionsGridProps) {
  const items = collections.length > 0
    ? collections.slice(0, 3).map((c) => ({
        title: c.title,
        handle: c.handle,
        image: c.image || `https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80`,
        subtitle: '',
      }))
    : placeholders

  return (
    <section className="m-section" style={{ background: '#fff' }}>
      <div className="m-container">
        <div className="m-section-heading m-section-heading--centered">
          <span className="m-section-heading__subtitle">Our Collections</span>
          <h2 className="m-section-heading__title">Shop by Category</h2>
        </div>

        <div className="m-grid-3" style={{ gap: 12 }}>
          {items.map((item, idx) => (
            <Link
              key={item.handle}
              href={`/collections/${item.handle}`}
              className="m-collection-card"
              style={{
                position: 'relative',
                display: 'block',
                aspectRatio: idx === 0 ? '3/4' : '3/4',
                overflow: 'hidden',
                background: '#f5f5f5',
                textDecoration: 'none',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="m-collection-card__img"
                style={{ position: 'absolute', inset: 0 }}
                loading="lazy"
              />
              {/* Gradient */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
              {/* Text */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 24px 28px' }}>
                <h3 style={{ color: '#fff', fontSize: 20, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.2 }}>{item.title}</h3>
                {item.subtitle && <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0 }}>{item.subtitle}</p>}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', marginTop: 14,
                  color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: 2,
                }}>
                  Shop Now →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
