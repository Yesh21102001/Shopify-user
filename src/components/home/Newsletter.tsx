'use client'

import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section style={{ background: '#111', color: '#fff', padding: '72px 32px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#64bf99', marginBottom: 16 }}>
          Newsletter
        </p>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          Get 10% Off Your First Order
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
          Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style tips.
        </p>

        {submitted ? (
          <div style={{ background: 'rgba(100,191,153,0.15)', border: '1px solid #64bf99', borderRadius: 4, padding: '16px 20px' }}>
            <p style={{ color: '#64bf99', fontWeight: 500, margin: 0 }}>
              Thanks for subscribing! Check your email for your 10% discount code.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', maxWidth: 440, margin: '0 auto' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              style={{
                flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)',
                borderRight: 'none', color: '#fff', padding: '13px 18px', fontSize: 14,
                outline: 'none', fontFamily: 'inherit', borderRadius: '2px 0 0 2px',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#fff', color: '#000', border: 'none', padding: '13px 24px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: '0 2px 2px 0',
                whiteSpace: 'nowrap', transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e8e8e8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              Subscribe
            </button>
          </form>
        )}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 14 }}>No spam. Unsubscribe at any time.</p>
      </div>
    </section>
  )
}
