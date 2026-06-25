'use client'

import Link from 'next/link'
import { X, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, close, removeItem, updateQty, getSubtotal, getItemCount } = useCartStore()
  const itemCount = getItemCount()
  const subtotal = getSubtotal()

  return (
    <div className={`m-cart-drawer${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
      <div className="m-cart-drawer__backdrop" onClick={close} />
      <div className="m-cart-drawer__panel">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #e8e8e8', flexShrink: 0 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
            Shopping Cart
            {itemCount > 0 && <span style={{ fontWeight: 400, color: '#666', marginLeft: 6, fontSize: 14 }}>({itemCount})</span>}
          </h2>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', display: 'flex', padding: 4 }} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
            <ShoppingBag size={56} color="#ddd" />
            <p style={{ fontSize: 16, fontWeight: 500, color: '#999', margin: 0 }}>Your cart is empty</p>
            <p style={{ fontSize: 14, color: '#bbb', margin: 0 }}>Add some products to get started.</p>
            <Link href="/products" onClick={close} className="m-btn m-btn--primary" style={{ marginTop: 8 }}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
            {items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} style={{ display: 'flex', gap: 14, paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                {/* Image */}
                <Link href={`/products/${item.handle}`} onClick={close} style={{ flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image || 'https://placehold.co/80x106/f5f5f5/bbb?text=+'}
                    alt={item.title}
                    style={{ width: 80, height: 106, objectFit: 'cover', display: 'block', background: '#f5f5f5' }}
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/products/${item.handle}`} onClick={close} style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, display: 'block', marginBottom: 4, color: '#000', textDecoration: 'none' }}>
                    {item.title}
                  </Link>
                  {item.variantTitle && item.variantTitle !== 'Default Title' && (
                    <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>{item.variantTitle}</p>
                  )}
                  <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 10px' }}>{formatPrice(item.price)}</p>

                  {/* Qty stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #e8e8e8', borderRadius: 2, width: 'fit-content' }}>
                    <button
                      onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)}
                      style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 500 }}>{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)}
                      style={{ width: 32, height: 32, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Remove + line total */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <button onClick={() => removeItem(item.productId, item.variantId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 2, display: 'flex' }}>
                    <X size={15} />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #e8e8e8', flexShrink: 0, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Subtotal</span>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{formatPrice(subtotal)}</span>
            </div>
            <p style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>Taxes and shipping calculated at checkout</p>
            <Link href="/cart" onClick={close} className="m-btn m-btn--outline" style={{ width: '100%', marginBottom: 10 }}>
              View Cart
            </Link>
            <Link href="/checkout" onClick={close} className="m-btn m-btn--primary" style={{ width: '100%' }}>
              Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
