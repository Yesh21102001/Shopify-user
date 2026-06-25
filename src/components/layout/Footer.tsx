'use client'

import Link from 'next/link'
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/collections' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const serviceLinks = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Returns & Exchanges', href: '/returns' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Privacy Policy', href: '/privacy' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#f5f5f5', marginTop: 0 }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px 48px' }}>
        <div className="m-footer-grid">

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'block', fontSize: 20, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000', marginBottom: 14 }}>
              STORE
            </Link>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, marginBottom: 20 }}>
              Discover the finest fashion and lifestyle products curated for modern living. Quality you can feel.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { href: 'https://instagram.com', icon: <Instagram size={15} />, label: 'Instagram' },
                { href: 'https://facebook.com', icon: <Facebook size={15} />, label: 'Facebook' },
                { href: 'https://twitter.com', icon: <Twitter size={15} />, label: 'Twitter' },
                { href: 'https://youtube.com', icon: <Youtube size={15} />, label: 'YouTube' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #d0d0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', transition: 'all 0.2s ease', textDecoration: 'none' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#d0d0d0'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000', marginBottom: 20 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ fontSize: 14, color: '#666', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000', marginBottom: 20 }}>Customer Service</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ fontSize: 14, color: '#666', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000', marginBottom: 20 }}>Get in Touch</h4>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 20 }}>
              <p style={{ margin: 0 }}>123 Fashion Street</p>
              <p style={{ margin: 0 }}>New York, NY 10001</p>
              <p style={{ margin: 0 }}>support@store.com</p>
              <p style={{ margin: 0 }}>+1 (800) 123-4567</p>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#000' }}>Newsletter</p>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex' }}>
              <input
                type="email"
                placeholder="Your email address"
                style={{ flex: 1, border: '1px solid #d0d0d0', borderRight: 'none', padding: '10px 14px', fontSize: 13, outline: 'none', borderRadius: '2px 0 0 2px', fontFamily: 'inherit', background: '#fff' }}
                onFocus={(e) => (e.target.style.borderColor = '#000')}
                onBlur={(e) => (e.target.style.borderColor = '#d0d0d0')}
              />
              <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', borderRadius: '0 2px 2px 0', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #e0e0e0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>© 2024 STORE. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 24 }}>
            {[{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }, { label: 'Sitemap', href: '/sitemap' }].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: 13, color: '#999', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
