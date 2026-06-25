'use client'

import Link from 'next/link'
import { Leaf, Star, Shield, Truck, Award, Users } from 'lucide-react'

const team = [
  { name: 'Sarah Mitchell', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80' },
  { name: 'James Park', role: 'Head of Design', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Priya Sharma', role: 'Creative Director', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80' },
  { name: 'Tom Rodriguez', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80' },
]

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '30+', label: 'Countries Shipped' },
  { value: '4.8', label: 'Average Rating' },
]

const values = [
  { icon: <Leaf size={28} />, title: 'Sustainability', desc: 'We use eco-friendly materials and work with certified sustainable manufacturers to reduce our environmental footprint.' },
  { icon: <Star size={28} />, title: 'Quality First', desc: 'Every piece passes our strict quality checks. If it doesn\'t meet our standards, it doesn\'t reach your door.' },
  { icon: <Shield size={28} />, title: 'Fair Trade', desc: 'Our factory partners pay fair wages, offer safe conditions, and respect workers\' rights — always.' },
  { icon: <Truck size={28} />, title: 'Fast Delivery', desc: 'From warehouse to your door, we partner with top couriers to get your order there fast and safely.' },
  { icon: <Award size={28} />, title: 'Award Winning', desc: 'Recognised by leading fashion publications for our commitment to design excellence and customer satisfaction.' },
  { icon: <Users size={28} />, title: 'Community', desc: 'We give back — 1% of every sale goes to support artisan communities in developing countries.' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: 520, display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#0a0a0a' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80"
          alt="About us hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.45 }}
        />
        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.5) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '100px 32px', width: '100%' }}>
          {/* Breadcrumb */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>About Us</span>
          </nav>

          <div style={{ maxWidth: 600 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#64bf99', marginBottom: 18 }}>
              Our Story
            </p>
            <h1 style={{ fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 20 }}>
              Crafting Style<br />Since 2020
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              We believe great fashion shouldn&apos;t cost the earth — in price or in planet. Premium quality, ethical sourcing, accessible to everyone.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/products"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 30px', background: '#fff', color: '#000', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e8e8e8')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                Shop Now
              </Link>
              <Link href="/contact"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 30px', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.55)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: '#000', color: '#fff', padding: '44px 32px' }}>
        <div className="m-grid-4" style={{ maxWidth: 1200, margin: '0 auto', gap: 24 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '8px 0', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Our story ── */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-grid-story">
            {/* Image */}
            <div style={{ position: 'relative' }}>
              <div style={{ aspectRatio: '4/5', overflow: 'hidden' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80"
                  alt="Our story"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              {/* Floating accent box */}
              <div className="m-story-float-box" style={{
                position: 'absolute', bottom: -28, right: -28,
                background: '#000', color: '#fff', padding: '24px 28px', width: 180,
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1 }}>2020</div>
                <div style={{ fontSize: 12, color: '#aaa', marginTop: 4, letterSpacing: '0.08em' }}>Founded</div>
              </div>
            </div>

            {/* Text */}
            <div>
              <span className="m-section-heading__subtitle">Who We Are</span>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, lineHeight: 1.18, letterSpacing: '-0.02em', marginBottom: 24 }}>
                Fashion That Feels<br />as Good as It Looks
              </h2>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.85, marginBottom: 18 }}>
                We started with a single collection and a single belief: people deserve clothing that&apos;s made to last, designed with intention, and priced fairly. Three years later, we&apos;ve shipped to over 30 countries and built a community of over 50,000 customers who share that belief.
              </p>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.85, marginBottom: 36 }}>
                Every season we curate new collections from carefully selected partners — independent designers, ethical factories, and artisan workshops — bringing you pieces that are built to outlast trends.
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { num: '100%', text: 'Ethical Sourcing' },
                  { num: '2yr', text: 'Product Guarantee' },
                  { num: 'Free', text: 'Returns' },
                ].map(item => (
                  <div key={item.text} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>{item.num}</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 2, letterSpacing: '0.06em' }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="m-section" style={{ background: '#f9f9f9' }}>
        <div className="m-container">
          <div className="m-section-heading m-section-heading--centered">
            <span className="m-section-heading__subtitle">What We Stand For</span>
            <h2 className="m-section-heading__title">Our Values</h2>
            <p style={{ fontSize: 15, color: '#666', marginTop: 12, maxWidth: 480, textAlign: 'center' }}>
              Everything we do is guided by six core principles that shape how we design, source, and deliver.
            </p>
          </div>
          <div className="m-grid-3" style={{ gap: 2 }}>
            {values.map((v) => (
              <div key={v.title} style={{
                background: '#fff', padding: '36px 28px',
                border: '1px solid #e8e8e8', transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}
              >
                <div style={{ width: 52, height: 52, background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, color: '#000' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="m-section">
        <div className="m-container">
          <div className="m-section-heading m-section-heading--centered">
            <span className="m-section-heading__subtitle">The People Behind It</span>
            <h2 className="m-section-heading__title">Meet the Team</h2>
          </div>
          <div className="m-grid-4" style={{ gap: 24 }}>
            {team.map(member => (
              <div key={member.name} style={{ textAlign: 'center' }}>
                <div style={{ aspectRatio: '1/1', overflow: 'hidden', marginBottom: 16, background: '#f5f5f5' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={member.img}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}
                  />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{member.name}</h3>
                <p style={{ fontSize: 13, color: '#888', margin: 0 }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: '#000', color: '#fff', padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#64bf99', marginBottom: 18 }}>
            Ready to Shop?
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Explore Our Latest Collections
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 36 }}>
            From everyday essentials to statement pieces — find your style.
          </p>
          <Link href="/collections"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 40px', background: '#fff', color: '#000', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e8e8e8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
            Browse Collections
          </Link>
        </div>
      </section>
    </>
  )
}
