'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getMyOrders } from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { router.push('/account/login'); return }
    getMyOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/account" className="text-subtext hover:text-black transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-medium">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white border border-border rounded-lg">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-subtext mb-6">When you place an order, it will appear here.</p>
          <Link href="/products" className="bg-black text-white px-6 py-3 rounded font-medium text-sm hover:bg-primary-hover transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-border rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-medium">Order #{order.orderNumber}</p>
                  <p className="text-sm text-subtext mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                    {order.status}
                  </span>
                  <Link href={`/account/orders/${order._id}`} className="text-subtext hover:text-black">
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {order.items.slice(0, 3).map((item, i) => (
                  <div key={i} className="w-14 h-14 bg-gray-100 rounded overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center text-xs text-subtext font-medium">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-subtext">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <span className="font-medium">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
