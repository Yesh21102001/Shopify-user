'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Minus, Plus, X, Tag, Truck, RotateCcw, Shield, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { validateDiscount } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, getSubtotal } = useCartStore()
  const subtotal = getSubtotal()

  const [discountCode, setDiscountCode] = useState('')
  const [appliedCode, setAppliedCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountError, setDiscountError] = useState('')
  const [discountLoading, setDiscountLoading] = useState(false)

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return
    setDiscountLoading(true)
    setDiscountError('')
    try {
      const result = await validateDiscount(discountCode, subtotal)
      if (result.valid) {
        setDiscountAmount(result.discount)
        setAppliedCode(discountCode)
        setDiscountCode('')
      } else {
        setDiscountError('Invalid or expired discount code.')
        setDiscountAmount(0)
      }
    } catch {
      setDiscountError('Could not apply discount. Please try again.')
      setDiscountAmount(0)
    } finally {
      setDiscountLoading(false)
    }
  }

  const shipping = subtotal >= 75 ? 0 : 5.99
  const total = subtotal - discountAmount + shipping

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <>
        <div style={{ borderBottom: '1px solid #e8e8e8', padding: '14px 0', background: '#fff' }}>
          <div className="m-container">
            <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999' }}>
              <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <span style={{ color: '#000' }}>Cart</span>
            </nav>
          </div>
        </div>
        <div className="m-container" style={{ paddingTop: 96, paddingBottom: 96, textAlign: 'center' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#ccc' }}>
            <ShoppingBag size={36} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>Your cart is empty</h1>
          <p style={{ fontSize: 15, color: '#888', marginBottom: 36 }}>Looks like you haven&apos;t added anything yet.</p>
          <Link href="/products"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', background: '#000', color: '#fff', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
            Start Shopping <ArrowRight size={15} />
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: '1px solid #e8e8e8', padding: '14px 0', background: '#fff' }}>
        <div className="m-container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999' }}>
            <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: '#000' }}>Cart</span>
          </nav>
        </div>
      </div>

      <div className="m-container" style={{ paddingTop: 40, paddingBottom: 72 }}>
        <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 40 }}>
          Shopping Cart
          <span style={{ fontSize: 16, fontWeight: 400, color: '#aaa', marginLeft: 12 }}>
            ({items.reduce((s, i) => s + i.qty, 0)} items)
          </span>
        </h1>

        <div className="m-grid-cart">

          {/* ── Cart items ── */}
          <div>
            {/* Table header — desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 130px 100px 40px', gap: 12, paddingBottom: 12, borderBottom: '2px solid #000', marginBottom: 0 }}
              className="hidden md:grid">
              {['Product', 'Price', 'Quantity', 'Total', ''].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999' }}>{h}</span>
              ))}
            </div>

            {/* Items */}
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`}
                style={{ borderBottom: '1px solid #e8e8e8', padding: '20px 0' }}>
                {/* Desktop row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 130px 100px 40px', gap: 12, alignItems: 'center' }}
                  className="hidden md:grid">
                  {/* Product */}
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ width: 76, height: 96, flexShrink: 0, background: '#f5f5f5', overflow: 'hidden', position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || 'https://placehold.co/76x96/f5f5f5/999?text=+'}
                        alt={item.title}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.handle}`}
                        style={{ fontSize: 14, fontWeight: 600, color: '#000', textDecoration: 'none', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.title}
                      </Link>
                      {item.variantTitle && item.variantTitle !== 'Default Title' && (
                        <p style={{ fontSize: 12, color: '#aaa', margin: '4px 0 0' }}>{item.variantTitle}</p>
                      )}
                    </div>
                  </div>
                  {/* Price */}
                  <span style={{ fontSize: 14, color: '#555' }}>{formatPrice(item.price)}</span>
                  {/* Qty stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8', width: 'fit-content' }}>
                    <button onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)}
                      style={{ width: 34, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}>
                      <Minus size={12} />
                    </button>
                    <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)}
                      style={{ width: 34, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}>
                      <Plus size={12} />
                    </button>
                  </div>
                  {/* Total */}
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</span>
                  {/* Remove */}
                  <button onClick={() => removeItem(item.productId, item.variantId)}
                    style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: '1px solid #e8e8e8', cursor: 'pointer', color: '#999', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#000' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#e8e8e8' }}>
                    <X size={13} />
                  </button>
                </div>

                {/* Mobile row */}
                <div style={{ display: 'flex', gap: 14 }} className="flex md:hidden">
                  <div style={{ width: 80, height: 100, flexShrink: 0, background: '#f5f5f5', overflow: 'hidden', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image || 'https://placehold.co/80x100/f5f5f5/999?text=+'} alt={item.title}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <Link href={`/products/${item.handle}`}
                        style={{ fontSize: 14, fontWeight: 600, color: '#000', textDecoration: 'none', lineHeight: 1.4 }}>
                        {item.title}
                      </Link>
                      <button onClick={() => removeItem(item.productId, item.variantId)}
                        style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: 0 }}>
                        <X size={16} />
                      </button>
                    </div>
                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p style={{ fontSize: 12, color: '#aaa', margin: '3px 0 8px' }}>{item.variantTitle}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e8e8e8' }}>
                        <button onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)}
                          style={{ width: 30, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Minus size={11} />
                        </button>
                        <span style={{ width: 30, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)}
                          style={{ width: 30, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <Plus size={11} />
                        </button>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, flexWrap: 'wrap', gap: 12 }}>
              <Link href="/products"
                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#555', textDecoration: 'none', fontWeight: 500 }}>
                ← Continue Shopping
              </Link>
              <button onClick={clearCart}
                style={{ fontSize: 13, color: '#bbb', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ border: '1px solid #e8e8e8', padding: '28px' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 24 }}>Order Summary</h2>

              {/* Line items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#666' }}>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: '#2a7a4f', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Tag size={13} /> {appliedCode}
                    </span>
                    <span style={{ color: '#2a7a4f', fontWeight: 600 }}>−{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Truck size={13} /> Shipping
                  </span>
                  <span style={{ fontWeight: 600, color: shipping === 0 ? '#2a7a4f' : '#000' }}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 75 && (
                  <p style={{ fontSize: 12, color: '#888', background: '#f9f9f9', padding: '8px 12px', margin: 0 }}>
                    Add {formatPrice(75 - subtotal)} more for free shipping
                  </p>
                )}
              </div>

              {/* Total */}
              <div style={{ borderTop: '2px solid #000', paddingTop: 16, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>{formatPrice(total)}</span>
                </div>
                <p style={{ fontSize: 11, color: '#bbb', margin: '4px 0 0', textAlign: 'right' }}>Including taxes</p>
              </div>

              {/* Discount code */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: '#333' }}>
                  Discount Code
                </p>
                <div style={{ display: 'flex', border: '1px solid #e8e8e8' }}>
                  <input
                    type="text" value={discountCode}
                    onChange={(e) => { setDiscountCode(e.target.value); setDiscountError('') }}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscount()}
                    placeholder="Enter code…"
                    style={{ flex: 1, border: 'none', padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'transparent' }}
                  />
                  <button onClick={handleApplyDiscount} disabled={discountLoading}
                    style={{ padding: '10px 16px', background: '#000', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: discountLoading ? 'wait' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', opacity: discountLoading ? 0.6 : 1 }}>
                    {discountLoading ? '…' : 'Apply'}
                  </button>
                </div>
                {discountError && (
                  <p style={{ fontSize: 12, color: '#da3f3f', margin: '6px 0 0' }}>{discountError}</p>
                )}
              </div>

              {/* CTA */}
              <Link href="/checkout"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '15px', background: '#000', color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#222')}
                onMouseLeave={e => (e.currentTarget.style.background = '#000')}>
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {/* Trust */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20 }}>
                {[
                  { icon: <Shield size={14} />, label: 'Secure' },
                  { icon: <Truck size={14} />, label: 'Fast Delivery' },
                  { icon: <RotateCcw size={14} />, label: 'Easy Returns' },
                ].map(t => (
                  <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#aaa' }}>
                    {t.icon} {t.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
