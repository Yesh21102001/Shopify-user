'use client'

import Link from 'next/link'
import { Heart, Eye } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, getDiscount, getMainImage } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const toggle = useWishlistStore((s) => s.toggle)
  const hasItem = useWishlistStore((s) => s.hasItem)
  const inWishlist = hasItem(product._id)

  const mainVariant = product.variants?.[0]
  const price = mainVariant?.price ?? 0
  const compareAtPrice = mainVariant?.compareAtPrice
  const discount = compareAtPrice ? getDiscount(price, compareAtPrice) : 0

  const isNew = (() => {
    try {
      const diff = (Date.now() - new Date(product.createdAt).getTime()) / 86400000
      return diff <= 30
    } catch { return false }
  })()

  const images = product.images || []
  const mainImg = getMainImage(images)
  const hoverImg = images.length > 1 ? (images[1].url || '') : ''

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!mainVariant) return
    addItem({
      productId: product._id,
      variantId: mainVariant._id,
      title: product.title,
      image: mainImg,
      variantTitle: mainVariant.title,
      price,
      qty: 1,
      handle: product.handle,
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggle(product._id)
  }

  return (
    <div className="m-product-card">
      {/* Image area */}
      <div className="m-product-card__media">
        <Link href={`/products/${product.handle}`} className="m-product-card__img-wrap" aria-label={product.title}>
          {/* Main image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImg}
            alt={images[0]?.alt || product.title}
            className="m-product-card__main-img"
            loading="lazy"
          />
          {/* Second image on hover */}
          {hoverImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hoverImg}
              alt={product.title}
              className="m-product-card__hover-img"
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="m-product-card__tags">
          {discount > 0 && <span className="m-product-tag m-product-tag--sale">-{discount}%</span>}
          {isNew && !discount && <span className="m-product-tag m-product-tag--new">New</span>}
        </div>

        {/* Top-right actions: Wishlist + Quick view */}
        <div className="m-product-card__action-top">
          <button
            className={`m-product-card__icon-btn${inWishlist ? ' active' : ''}`}
            onClick={handleWishlist}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={16} fill={inWishlist ? '#da3f3f' : 'none'} />
          </button>
          <Link
            href={`/products/${product.handle}`}
            className="m-product-card__icon-btn"
            aria-label="Quick view"
          >
            <Eye size={16} />
          </Link>
        </div>

        {/* Bottom action: Add to Cart slides up */}
        <div className="m-product-card__action-bottom">
          <button className="m-product-card__atc-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="m-product-card__info">
        {product.vendor && (
          <span className="m-product-card__vendor">{product.vendor}</span>
        )}
        <Link href={`/products/${product.handle}`} className="m-product-card__name">
          {product.title}
        </Link>
        <div className="m-product-card__price">
          <span className={`m-product-card__price-current${discount > 0 ? ' m-product-card__price-current--sale' : ''}`}>
            {formatPrice(price)}
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="m-product-card__price-compare">{formatPrice(compareAtPrice)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
