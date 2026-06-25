'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { ChevronRight, Lock } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { createOrder, validateDiscount } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

interface CheckoutForm {
  email: string
  name: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  paymentMethod: 'cod' | 'card' | 'upi'
  shippingMethod: 'free' | 'standard' | 'express'
}

const shippingOptions = [
  { id: 'free', label: 'Free Shipping', desc: '5–10 business days', price: 0 },
  { id: 'standard', label: 'Standard Shipping', desc: '3–5 business days', price: 5.99 },
  { id: 'express', label: 'Express Shipping', desc: '1–2 business days', price: 14.99 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, clearCart } = useCartStore()
  const { user, token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [discountCode, setDiscountCode] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountError, setDiscountError] = useState('')
  const [selectedShipping, setSelectedShipping] = useState('free')

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      paymentMethod: 'cod',
      shippingMethod: 'free',
      country: 'India',
    },
  })

  const subtotal = getSubtotal()
  const shippingCost = shippingOptions.find(o => o.id === selectedShipping)?.price || 0
  const total = subtotal + shippingCost - discountAmount

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
        <Link href="/products" className="bg-black text-white px-6 py-3 rounded font-medium text-sm">Continue Shopping</Link>
      </div>
    )
  }

  const applyDiscount = async () => {
    setDiscountError('')
    try {
      const res = await validateDiscount(discountCode, subtotal)
      setDiscountAmount(res.discount || 0)
    } catch (err: any) {
      setDiscountError(err.response?.data?.message || 'Invalid discount code')
      setDiscountAmount(0)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true)
    try {
      const orderData = {
        email: data.email,
        shippingAddress: { name: data.name, phone: data.phone, address: data.address, city: data.city, state: data.state, zip: data.zip, country: data.country },
        items: items.map(i => ({ productId: i.productId, title: i.title, image: i.image, variantTitle: i.variantTitle, sku: '', price: i.price, qty: i.qty })),
        subtotal,
        shippingCost,
        discountAmount,
        total,
        paymentMethod: data.paymentMethod,
        discountCode: discountAmount > 0 ? discountCode : undefined,
      }
      const res = await createOrder(orderData)
      clearCart()
      router.push(`/account/orders`)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 max-w-6xl">
      <div className="flex items-center gap-2 text-sm text-subtext mb-8">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight size={14} />
        <Link href="/cart" className="hover:text-black">Cart</Link>
        <ChevronRight size={14} />
        <span className="text-black">Checkout</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="font-medium text-lg mb-4">Contact</h2>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input type="email" {...register('email', { required: 'Email is required' })}
                  className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="font-medium text-lg mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Full name</label>
                    <input {...register('name', { required: 'Required' })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Phone</label>
                    <input {...register('phone', { required: 'Required' })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Address</label>
                  <input {...register('address', { required: 'Required' })}
                    className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                  {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">City</label>
                    <input {...register('city', { required: 'Required' })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">State</label>
                    <input {...register('state', { required: 'Required' })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                    {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">ZIP code</label>
                    <input {...register('zip', { required: 'Required' })}
                      className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                    {errors.zip && <p className="mt-1 text-xs text-red-500">{errors.zip.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Country</label>
                  <input {...register('country', { required: 'Required' })}
                    className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black" />
                </div>
              </div>
            </div>

            {/* Shipping method */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="font-medium text-lg mb-4">Shipping Method</h2>
              <div className="space-y-3">
                {shippingOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${selectedShipping === opt.id ? 'border-black' : 'border-border hover:border-gray-400'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" value={opt.id} checked={selectedShipping === opt.id}
                        onChange={() => setSelectedShipping(opt.id)} className="accent-black" />
                      <div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-xs text-subtext">{opt.desc}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium">{opt.price === 0 ? 'Free' : formatPrice(opt.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="font-medium text-lg mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery' },
                  { value: 'card', label: 'Credit / Debit Card' },
                  { value: 'upi', label: 'UPI' },
                ].map((opt) => (
                  <label key={opt.value}
                    className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-gray-400 has-[:checked]:border-black transition-colors">
                    <input type="radio" value={opt.value} {...register('paymentMethod')} className="accent-black" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-border rounded-lg p-6 sticky top-6">
              <h2 className="font-medium text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">{item.qty}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-subtext">{item.variantTitle}</p>
                    </div>
                    <span className="text-sm font-medium flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex gap-2">
                  <input
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Discount code"
                    className="flex-1 border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                  <button type="button" onClick={applyDiscount}
                    className="px-4 py-2 border border-black rounded text-sm font-medium hover:bg-black hover:text-white transition-colors">
                    Apply
                  </button>
                </div>
                {discountError && <p className="text-xs text-red-500">{discountError}</p>}
                {discountAmount > 0 && <p className="text-xs text-green-600">Discount applied: -{formatPrice(discountAmount)}</p>}
              </div>

              <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-subtext">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-subtext">
                  <span>Shipping</span><span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span><span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-base pt-2 border-t border-border">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 bg-black text-white py-3.5 rounded font-medium text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
