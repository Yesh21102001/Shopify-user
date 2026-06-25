'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectCartItems, selectCartSubtotal, removeItem, updateQty } from '@/store/slices/cartSlice'

const SHIPPING_THRESHOLD = 100
const TAX_RATE = 0.08

export default function CartPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)

  const [quantity, setQuantity] = useState({})

  // Initialize quantities from cart items
  React.useEffect(() => {
    const initialQty = {}
    cartItems.forEach((item) => {
      const key = `${item.productId}-${item.variantId}`
      initialQty[key] = item.qty
    })
    setQuantity(initialQty)
  }, [cartItems])

  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : 10
  const tax = subtotal * TAX_RATE
  const total = subtotal + shippingCost + tax

  const handleQuantityChange = (productId, variantId, newQty) => {
    const key = `${productId}-${variantId}`
    const qty = Math.max(1, newQty)
    setQuantity((prev) => ({ ...prev, [key]: qty }))
    dispatch(updateQty({ productId, variantId, qty }))
  }

  const handleRemoveItem = (productId, variantId) => {
    dispatch(removeItem({ productId, variantId }))
  }

  const handleCheckout = () => {
    router.push('/checkout')
  }

  const handleContinueShopping = () => {
    router.push('/products')
  }

  // Empty state
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Your Cart is Empty
          </h1>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 32, lineHeight: '1.6' }}>
            Looks like you haven't added any items yet. Start exploring our collection to find something you love.
          </p>
          <Link
            href="/products"
            style={{
              display: 'inline-block',
              background: '#000',
              color: '#fff',
              padding: '14px 36px',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#000')}
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  // Cart with items
  return (
    <div style={{ minHeight: '80vh', padding: '40px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Heading */}
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 40, letterSpacing: '-0.02em' }}>
          Shopping Cart
        </h1>

        {/* Main grid: table + sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 40, marginBottom: 40 }}>
          {/* Left: Cart table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
                  <th style={{ textAlign: 'left', padding: '16px 0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
                    Product
                  </th>
                  <th style={{ textAlign: 'right', padding: '16px 0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
                    Price
                  </th>
                  <th style={{ textAlign: 'center', padding: '16px 0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
                    Quantity
                  </th>
                  <th style={{ textAlign: 'right', padding: '16px 0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>
                    Subtotal
                  </th>
                  <th style={{ textAlign: 'center', padding: '16px 0', width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const key = `${item.productId}-${item.variantId}`
                  const itemQty = quantity[key] || item.qty
                  const itemSubtotal = item.price * itemQty

                  return (
                    <tr key={key} style={{ borderBottom: '1px solid #e8e8e8' }}>
                      {/* Product */}
                      <td style={{ padding: '24px 0', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              backgroundColor: '#f5f5f5',
                              borderRadius: 4,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <Link
                              href={`/products/${item.handle || item.productId}`}
                              style={{
                                display: 'block',
                                fontSize: 14,
                                fontWeight: 500,
                                color: '#000',
                                textDecoration: 'none',
                                marginBottom: 4,
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = '#666')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = '#000')}
                            >
                              {item.name}
                            </Link>
                            {item.variantId && (
                              <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                                Variant: {item.variantId}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: '24px 0', textAlign: 'right', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>
                          ${item.price.toFixed(2)}
                        </span>
                      </td>

                      {/* Quantity controls */}
                      <td style={{ padding: '24px 0', textAlign: 'center', verticalAlign: 'middle' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          border: '1px solid #e8e8e8',
                          borderRadius: 4,
                          width: 100,
                          margin: '0 auto',
                        }}>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, itemQty - 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '8px 8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#666',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            value={itemQty}
                            onChange={(e) => handleQuantityChange(item.productId, item.variantId, parseInt(e.target.value) || 1)}
                            style={{
                              width: 30,
                              textAlign: 'center',
                              border: 'none',
                              fontSize: 14,
                              fontWeight: 500,
                            }}
                            min="1"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.variantId, itemQty + 1)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '8px 8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#666',
                              transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td style={{ padding: '24px 0', textAlign: 'right', verticalAlign: 'middle' }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                          ${itemSubtotal.toFixed(2)}
                        </span>
                      </td>

                      {/* Remove button */}
                      <td style={{ padding: '24px 0', textAlign: 'center', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.variantId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#999',
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 4,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#d32f2f')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Right: Order summary sidebar */}
          <div style={{ height: 'fit-content', position: 'sticky', top: 20 }}>
            <div style={{
              border: '1px solid #e8e8e8',
              borderRadius: 4,
              padding: 24,
              backgroundColor: '#fafafa',
            }}>
              <h3 style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 24,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Order Summary
              </h3>

              {/* Summary rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>${subtotal.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#666' }}>
                    Shipping
                    {subtotal >= SHIPPING_THRESHOLD && <span style={{ color: '#4caf50', marginLeft: 4 }}>(FREE)</span>}
                  </span>
                  <span style={{ fontWeight: 500, color: shippingCost === 0 ? '#4caf50' : '#000' }}>
                    ${shippingCost.toFixed(2)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: '#666' }}>Tax (est.)</span>
                  <span style={{ fontWeight: 500 }}>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 18,
                fontWeight: 700,
                padding: '16px 0',
                borderTop: '2px solid #e8e8e8',
                marginBottom: 24,
              }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Shipping notice */}
              {subtotal < SHIPPING_THRESHOLD && (
                <p style={{
                  fontSize: 12,
                  color: '#f57c00',
                  backgroundColor: 'rgba(245, 124, 0, 0.08)',
                  padding: '8px 12px',
                  borderRadius: 4,
                  marginBottom: 16,
                  margin: 0,
                }}>
                  Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: 4,
                  marginBottom: 12,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#000')}
              >
                Proceed to Checkout
              </button>

              {/* Continue shopping button */}
              <button
                onClick={handleContinueShopping}
                style={{
                  width: '100%',
                  background: '#fff',
                  color: '#000',
                  border: '1px solid #e8e8e8',
                  padding: '14px 0',
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  borderRadius: 4,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f5f5f5'
                  e.currentTarget.style.borderColor = '#999'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = '#e8e8e8'
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .cart-container {
            grid-template-columns: 1fr !important;
          }

          .cart-table {
            font-size: 12px;
          }

          .cart-table td {
            padding: 16px 0 !important;
          }

          .product-image {
            width: 60px;
            height: 60px;
          }

          .sidebar {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
