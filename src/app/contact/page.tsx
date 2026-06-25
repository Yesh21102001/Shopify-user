'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Send } from 'lucide-react'

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3–7 business days. Express shipping (1–2 days) is available at checkout.' },
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, with original tags attached.' },
  { q: 'Do you ship internationally?', a: 'Yes — we ship to 30+ countries worldwide. International shipping takes 7–14 business days.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive a tracking number by email. You can also track it in your account.' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: 360, display: 'flex', alignItems: 'center', background: '#0a0a0a', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=1600&q=80"
          alt="Contact us"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, objectPosition: 'center 60%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.3) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '80px 32px', width: '100%' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>Contact</span>
          </nav>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#64bf99', marginBottom: 16 }}>
            We&apos;d Love to Hear From You
          </p>
          <h1 style={{ fontSize: 'clamp(34px, 5vw, 60px)', fontWeight: 800, color: '#fff', lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0 }}>
            Get in Touch
          </h1>
        </div>
      </section>

      {/* ── Main: info + form ── */}
      <section style={{ background: '#fff' }}>
        <div className="m-grid-contact" style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Left panel — dark */}
          <div style={{ background: '#111', color: '#fff', padding: '56px 40px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>Contact Information</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 44 }}>
              Fill out the form and our team will get back to you within 24 hours.
            </p>

            {[
              { icon: <Phone size={17} />, label: 'Phone', value: '+1 (800) 123-4567' },
              { icon: <Mail size={17} />, label: 'Email', value: 'support@store.com' },
              { icon: <MapPin size={17} />, label: 'Address', value: '123 Fashion Street\nNew York, NY 10001' },
              { icon: <Clock size={17} />, label: 'Hours', value: 'Mon–Fri: 9AM–6PM EST\nSat: 10AM–4PM EST' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
                <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#64bf99' }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.6 }}>{item.value}</p>
                </div>
              </div>
            ))}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0 28px' }} />

            {/* Social */}
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Follow Us</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { icon: <Instagram size={16} />, href: 'https://instagram.com' },
                { icon: <Facebook size={16} />, href: 'https://facebook.com' },
                { icon: <Twitter size={16} />, href: 'https://twitter.com' },
              ].map(({ icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
                  {icon}
                </a>
              ))}
            </div>

            {/* Decorative circles */}
            <div style={{ position: 'relative', marginTop: 'auto', paddingTop: 40 }}>
              <div style={{ width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', position: 'absolute', bottom: -80, right: -80 }} />
              <div style={{ width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', position: 'absolute', bottom: -20, right: -20 }} />
            </div>
          </div>

          {/* Right panel — form */}
          <div style={{ padding: '56px 48px' }}>
            {sent ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16 }}>
                <div style={{ width: 72, height: 72, background: '#f0fff8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                  ✓
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Message Sent!</h3>
                <p style={{ fontSize: 15, color: '#666', maxWidth: 360, lineHeight: 1.6 }}>
                  Thank you for reaching out. We&apos;ll get back to you within 1–2 business days.
                </p>
                <button onClick={() => setSent(false)}
                  style={{ marginTop: 8, padding: '11px 28px', background: '#000', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.06em' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>Send Us a Message</h2>
                <p style={{ fontSize: 14, color: '#888', marginBottom: 36 }}>We typically reply within 24 hours on weekdays.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="m-grid-form" style={{ gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: '#333' }}>Full Name *</label>
                      <input required value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Smith"
                        style={{ width: '100%', border: '1px solid #e8e8e8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#000', background: '#fff', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.target.style.borderColor = '#000')}
                        onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: '#333' }}>Email Address *</label>
                      <input required type="email" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="john@email.com"
                        style={{ width: '100%', border: '1px solid #e8e8e8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#000', background: '#fff', transition: 'border-color 0.2s' }}
                        onFocus={e => (e.target.style.borderColor = '#000')}
                        onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: '#333' }}>Subject</label>
                    <select value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      style={{ width: '100%', border: '1px solid #e8e8e8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: form.subject ? '#000' : '#aaa', background: '#fff', appearance: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onFocus={e => (e.target.style.borderColor = '#000')}
                      onBlur={e => (e.target.style.borderColor = '#e8e8e8')}>
                      <option value="">Select a topic…</option>
                      <option>Order Enquiry</option>
                      <option>Return or Exchange</option>
                      <option>Product Question</option>
                      <option>Shipping Issue</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: '#333' }}>Message *</label>
                    <textarea required rows={6} value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help…"
                      style={{ width: '100%', border: '1px solid #e8e8e8', padding: '12px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#000', background: '#fff', resize: 'vertical', transition: 'border-color 0.2s', lineHeight: 1.6 }}
                      onFocus={e => (e.target.style.borderColor = '#000')}
                      onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />
                  </div>

                  <div>
                    <button type="submit"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 36px', background: '#000', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#000')}>
                      <Send size={15} />
                      Send Message
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="m-section" style={{ background: '#f9f9f9' }}>
        <div className="m-container">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div className="m-section-heading m-section-heading--centered">
              <span className="m-section-heading__subtitle">Common Questions</span>
              <h2 className="m-section-heading__title">Frequently Asked Questions</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#000' }}>{faq.q}</span>
                    <span style={{ fontSize: 22, color: '#999', lineHeight: 1, flexShrink: 0, marginLeft: 16, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 24px 20px', fontSize: 14, color: '#666', lineHeight: 1.75, borderTop: '1px solid #f0f0f0' }}>
                      <p style={{ margin: '16px 0 0' }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: 14, color: '#888', marginTop: 32 }}>
              Still have questions?{' '}
              <a href="mailto:support@store.com" style={{ color: '#000', fontWeight: 600, textDecoration: 'underline' }}>
                Email us directly
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
