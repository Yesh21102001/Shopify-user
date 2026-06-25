'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { getProducts } from '@/lib/api'
import { formatPrice, getDiscount, getMainImage } from '@/lib/utils'
import type { Product } from '@/types'

export default function WishlistPage() {
  const { productIds, removeItem } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.open)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productIds.length === 0) { setLoading(false); return }
    getProducts({ ids: productIds.join(','), limit: 50 })
      .then((data) => setProducts((data.products || []).filter((p: Product) => productIds.includes(p._id))))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [productIds.length])

  const handleAddToCart = (product: Product) => {
    const variant = product.variants?.[0]
    if (!variant) return
    addToCart({
      productId: product._id,
      variantId: variant._id,
      title: product.title,
      image: getMainImage(product.images),
      variantTitle: variant.title,
      price: variant.price,
      qty: 1,
      handle: product.handle,
    })
    openCart()
  }

  return (
    <div className="container py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium">My Wishlist</h1>
        {productIds.length > 0 && (
          <span className="text-sm text-subtext">{productIds.length} item{productIds.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded mb-3" />
              <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : productIds.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={56} className="mx-auto text-gray-200 mb-5" />
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-subtext mb-8">Save items you love to find them easily later.</p>
          <Link href="/products" className="bg-black text-white px-8 py-3 rounded font-medium text-sm hover:bg-primary-hover transition-colors">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const variant = product.variants?.[0]
            const price = variant?.price || 0
            const compareAtPrice = variant?.compareAtPrice
            const discount = compareAtPrice ? getDiscount(price, compareAtPrice) : 0

            return (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded mb-3">
                  <Link href={`/products/${product.handle}`}>
                    <img
                      src={getMainImage(product.images)}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-badge-sale text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      -{discount}%
                    </span>
                  )}
                  <button
                    onClick={() => removeItem(product._id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <Heart size={16} className="fill-red-500 text-red-500" />
                  </button>
                </div>

                <Link href={`/products/${product.handle}`}>
                  <h3 className="text-sm font-medium hover:underline truncate">{product.title}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <span className="text-sm font-medium">{formatPrice(price)}</span>
                  {compareAtPrice && (
                    <span className="text-xs text-subtext line-through">{formatPrice(compareAtPrice)}</span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full border border-black text-black text-sm py-2 rounded font-medium hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  Add to Cart
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
