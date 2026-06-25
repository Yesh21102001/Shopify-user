'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ShoppingBag, Plus, Minus } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import {
  selectCartItems,
  selectCartSubtotal,
  removeItem,
  updateQty
} from '@/store/slices/cartSlice'

export default function CartDrawer({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false)
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)

  // Hydration safety
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)

  const handleRemove = (productId, variantId) => {
    dispatch(removeItem({ productId, variantId }))
  }

  const handleUpdateQty = (productId, variantId, newQty) => {
    if (newQty < 1) return
    dispatch(updateQty({ productId, variantId, qty: newQty }))
  }

  const handleClose = () => {
    onClose()
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-md bg-white shadow-lg z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-labelledby="cart-drawer-title"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 id="cart-drawer-title" className="text-lg font-semibold text-gray-900">
            Shopping Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-600 ml-2">({itemCount})</span>
            )}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close cart"
          >
            <X size={20} className="text-gray-900" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center">
              <ShoppingBag size={56} className="text-gray-300" />
              <p className="text-base font-medium text-gray-600">Your cart is empty</p>
              <p className="text-sm text-gray-500">Add some products to get started.</p>
              <Link
                href="/products"
                onClick={handleClose}
                className="mt-4 inline-block bg-black text-white px-6 py-2.5 font-medium text-sm rounded hover:bg-gray-800 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            // Items List
            <div className="px-6 py-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-4 py-5 mb-5 pb-5 border-b border-gray-100 last:border-b-0"
                >
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.handle || item.productId}`}
                    onClick={handleClose}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.image || 'https://placehold.co/80x106/f5f5f5/bbb?text=+'}
                      alt={item.name}
                      className="w-20 h-28 object-cover bg-gray-100 rounded"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.handle || item.productId}`}
                      onClick={handleClose}
                      className="text-sm font-medium text-gray-900 hover:text-gray-700 block mb-1 line-clamp-2"
                    >
                      {item.name}
                    </Link>

                    {item.variantTitle && item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-gray-500 mb-2">{item.variantTitle}</p>
                    )}

                    <p className="text-sm font-semibold text-gray-900 mb-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-gray-300 rounded w-fit">
                      <button
                        onClick={() =>
                          handleUpdateQty(
                            item.productId,
                            item.variantId,
                            item.qty - 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} className="text-gray-900" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium text-gray-900">
                        {item.qty}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQty(
                            item.productId,
                            item.variantId,
                            item.qty + 1
                          )
                        }
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} className="text-gray-900" />
                      </button>
                    </div>
                  </div>

                  {/* Remove & Line Total */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button
                      onClick={() =>
                        handleRemove(item.productId, item.variantId)
                      }
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Visible only when cart has items) */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-6 py-5 flex-shrink-0">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-900">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Taxes and shipping calculated at checkout
            </p>

            <div className="space-y-2">
              <Link
                href="/cart"
                onClick={handleClose}
                className="block w-full text-center border border-gray-900 text-gray-900 font-medium text-sm py-2.5 rounded hover:bg-gray-50 transition-colors"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={handleClose}
                className="block w-full text-center bg-black text-white font-medium text-sm py-2.5 rounded hover:bg-gray-800 transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
