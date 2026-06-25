'use client'

import Link from 'next/link'

const slides = [
  {
    id: 1,
    subtitle: 'New Collection 2024',
    title: 'Discover\nYour Style',
    desc: 'Explore our latest arrivals and find pieces that define who you are. Premium quality, timeless design.',
    bg: '#1a1a1a',
    imgUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80',
    btnLabel: 'Shop Now',
    btnHref: '/products',
    btnOutlineLabel: 'Explore Collections',
    btnOutlineHref: '/collections',
    align: 'left' as const,
  },
]

export default function HeroBanner() {
  const slide = slides[0]

  return (
    <section style={{ position: 'relative', width: '100%', minHeight: 620, display: 'flex', alignItems: 'center', overflow: 'hidden', background: slide.bg }}>
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.imgUrl}
        alt="Hero banner"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        loading="eager"
      />
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.08) 100%)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ maxWidth: 560 }} className="animate-fade-in-up">
          <p style={{ color: '#64bf99', fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 18, display: 'block' }}>
            {slide.subtitle}
          </p>
          <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 24, whiteSpace: 'pre-line', letterSpacing: '-0.02em' }}>
            {slide.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
            {slide.desc}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link
              href={slide.btnHref}
              style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', background: '#fff', color: '#000', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              {slide.btnLabel}
            </Link>
            <Link
              href={slide.btnOutlineHref}
              style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.7)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
            >
              {slide.btnOutlineLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
