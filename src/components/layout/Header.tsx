'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const megaMenu = {
  featured: [
    { label: "Men's Collection", href: '/collections/men', img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80', sub: '120+ styles' },
    { label: "Women's Collection", href: '/collections/women', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', sub: '200+ styles' },
    { label: 'Accessories', href: '/collections/accessories', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80', sub: '80+ styles' },
  ],
  links: [
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: 'Best Sellers', href: '/products?sort=best-selling' },
    { label: 'Sale Items', href: '/collections/sale' },
    { label: 'All Collections', href: '/collections' },
  ],
}

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileCollOpen, setMobileCollOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openCart = useCartStore((s) => s.open)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const wishlistIds = useWishlistStore((s) => s.productIds)
  const itemCount = getItemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 80)
    }
  }, [searchOpen])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, searchOpen])

  const openMega = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    megaTimerRef.current = setTimeout(() => setMegaOpen(false), 120)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchOpen(false)
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          {/* position:relative so the absolutely-centered nav doesn't escape */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', height: 70 }}>

            {/* ── Logo — always left ── */}
            <Link href="/" style={{
              fontSize: 20, fontWeight: 800, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#000', textDecoration: 'none',
              flexShrink: 0,
            }}>
              STORE
            </Link>

            {/* ── Desktop nav — absolutely centered, invisible on mobile ── */}
            <nav className="hidden lg:flex" style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              alignItems: 'center', gap: 32,
            }}>
              {navLinks.slice(0, 1).map(link => (
                <Link key={link.href} href={link.href} className={`m-nav-link${isActive(link.href) ? ' active' : ''}`}>
                  {link.label}
                </Link>
              ))}

              {/* Collections mega trigger */}
              <div style={{ position: 'relative' }} onMouseEnter={openMega} onMouseLeave={closeMega}>
                <button className={`m-nav-link${pathname.startsWith('/collections') ? ' active' : ''}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                  Collections
                  <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: megaOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {/* Mega menu */}
                {megaOpen && (
                  <div onMouseEnter={openMega} onMouseLeave={closeMega} style={{
                    position: 'absolute', top: 'calc(100% + 1px)', left: '50%', transform: 'translateX(-50%)',
                    background: '#fff', border: '1px solid #e8e8e8', borderTop: '2px solid #000',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.12)', zIndex: 300,
                    width: 680, padding: '28px 28px 24px',
                    animation: 'fadeInDown 0.18s ease',
                  }}>
                    <style>{`@keyframes fadeInDown{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 160px', gap: 20 }}>
                      {megaMenu.featured.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setMegaOpen(false)}
                          style={{ textDecoration: 'none', color: '#000' }}>
                          <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f5f5f5', marginBottom: 10 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.img} alt={item.label}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                              onMouseLeave={e => (e.currentTarget.style.transform = '')} />
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{item.label}</p>
                          <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{item.sub}</p>
                        </Link>
                      ))}
                      {/* Quick links column */}
                      <div style={{ borderLeft: '1px solid #f0f0f0', paddingLeft: 20 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#999', marginBottom: 16 }}>
                          Quick Links
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {megaMenu.links.map(l => (
                            <Link key={l.href} href={l.href} onClick={() => setMegaOpen(false)}
                              style={{ fontSize: 14, color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.15s' }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#000')}
                              onMouseLeave={e => (e.currentTarget.style.color = '#333')}>
                              <ArrowRight size={12} /> {l.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {navLinks.slice(1).map(link => (
                <Link key={link.href} href={link.href} className={`m-nav-link${isActive(link.href) ? ' active' : ''}`}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ── Icons — always right via marginLeft:auto ── */}
            <div className="m-header-icons" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>

              {/* Search */}
              <button onClick={() => setSearchOpen(true)} className="m-header-icon" aria-label="Search">
                <Search size={18} />
              </button>

              {/* Account */}
              <Link href="/account" className="m-header-icon" aria-label="Account">
                <User size={18} />
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist" className="m-header-icon" aria-label="Wishlist">
                <Heart size={18} />
                {wishlistIds.length > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    background: '#da3f3f', color: '#fff', fontSize: 9, fontWeight: 700,
                    width: 15, height: 15, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                  }}>
                    {wishlistIds.length > 9 ? '9+' : wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button onClick={openCart} className="m-header-icon" aria-label="Cart">
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    background: '#da3f3f', color: '#fff', fontSize: 9, fontWeight: 700,
                    width: 15, height: 15, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                  }}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger — hidden on desktop via Tailwind */}
              <button onClick={() => setMobileOpen(true)} className="m-header-icon flex lg:hidden" aria-label="Open menu">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }} onClick={() => setSearchOpen(false)} />
          <div style={{
            position: 'relative', zIndex: 1, background: '#fff',
            padding: '24px 32px', boxShadow: '0 4px 32px rgba(0,0,0,0.12)',
          }}>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2px solid #000', paddingBottom: 12 }}>
                <Search size={22} style={{ color: '#666', flexShrink: 0 }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for products, collections…"
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 20, color: '#000', background: 'transparent', fontFamily: 'inherit' }}
                />
                <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', padding: 4 }}>
                  <X size={20} />
                </button>
              </form>
              <p style={{ fontSize: 12, color: '#bbb', marginTop: 10 }}>
                Press Enter to search · Popular: <button onClick={() => { setSearchQuery('dress'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: '0 4px', textDecoration: 'underline' }}>dress</button>
                <button onClick={() => { setSearchQuery('jacket'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: '0 4px', textDecoration: 'underline' }}>jacket</button>
                <button onClick={() => { setSearchQuery('accessories'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, padding: '0 4px', textDecoration: 'underline' }}>accessories</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setMobileOpen(false)} />
          <aside style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 320, maxWidth: '88vw',
            background: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto',
            boxShadow: '4px 0 32px rgba(0,0,0,0.12)',
            animation: 'slideInLeft 0.28s ease',
          }}>
            <style>{`@keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #e8e8e8' }}>
              <Link href="/" onClick={() => setMobileOpen(false)}
                style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', textDecoration: 'none' }}>
                STORE
              </Link>
              <button onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Search in mobile */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0' }}>
              <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { setMobileOpen(false); window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}` } }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e8e8e8', borderRadius: 4, padding: '8px 12px' }}>
                <Search size={15} style={{ color: '#aaa' }} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search…"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: 14, fontFamily: 'inherit', color: '#000', background: 'transparent' }} />
              </form>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1 }}>
              <Link href="/" onClick={() => setMobileOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #f4f4f4', fontSize: 15, fontWeight: 600, color: '#000', textDecoration: 'none' }}>
                Home
              </Link>

              {/* Collections expandable */}
              <div style={{ borderBottom: '1px solid #f4f4f4' }}>
                <button onClick={() => setMobileCollOpen(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '15px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#000' }}>
                  Collections
                  <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: mobileCollOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                {mobileCollOpen && (
                  <div style={{ background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
                    {[
                      { label: 'All Collections', href: '/collections' },
                      ...megaMenu.featured.map(f => ({ label: f.label, href: f.href })),
                      ...megaMenu.links.filter(l => !l.href.includes('sort')),
                    ].map(link => (
                      <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                        style={{ display: 'block', padding: '11px 20px 11px 32px', fontSize: 14, color: '#444', textDecoration: 'none', borderBottom: '1px solid #f4f4f4' }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.slice(1).map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', borderBottom: '1px solid #f4f4f4', fontSize: 15, fontWeight: 600, color: '#000', textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Footer links */}
            <div style={{ padding: '20px', borderTop: '1px solid #e8e8e8', display: 'flex', gap: 20 }}>
              <Link href="/account" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555', textDecoration: 'none' }}>
                <User size={15} /> Account
              </Link>
              <Link href="/wishlist" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555', textDecoration: 'none' }}>
                <Heart size={15} /> Wishlist {wishlistIds.length > 0 && `(${wishlistIds.length})`}
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
