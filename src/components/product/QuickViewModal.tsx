'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, getMainImage } from '@/lib/utils'
import VariantSelector from './VariantSelector'
import QuantitySelector from './QuantitySelector'
import type { Product, Variant } from '@/types'

interface QuickViewModalProps {
  product: Product
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((s) => s.addItem)

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    product.options.reduce((acc, opt) => {
      acc[opt.name] = opt.values[0] ?? ''
      return acc
    }, {} as Record<string, string>)
  )
  const [qty, setQty] = useState(1)

  const selectedVariant: Variant | undefined = product.variants.find((v) =>
    Object.entries(selectedOptions).every(([k, val]) => v.options[k] === val)
  ) ?? product.variants[0]

  const price = selectedVariant?.price ?? 0
  const compareAtPrice = selectedVariant?.compareAtPrice

  const handleAddToCart = () => {
    if (!selectedVariant) return
    addItem({
      productId: product._id,
      variantId: selectedVariant._id,
      title: product.title,
      image: getMainImage(product.images),
      variantTitle: selectedVariant.title,
      price,
      qty,
      handle: product.handle,
    })
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 hover:opacity-60 transition"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-l-lg overflow-hidden">
              <Image
                src={getMainImage(product.images)}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col gap-4">
              <h2 className="text-xl font-semibold leading-snug">{product.title}</h2>

              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{formatPrice(price)}</span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(compareAtPrice)}</span>
                )}
              </div>

              {product.shortDescription && (
                <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>
              )}

              {product.options.length > 0 && (
                <VariantSelector
                  options={product.options}
                  selectedOptions={selectedOptions}
                  onChange={(name, value) =>
                    setSelectedOptions((prev) => ({ ...prev, [name]: value }))
                  }
                  variants={product.variants}
                />
              )}

              <QuantitySelector value={qty} onChange={setQty} />

              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                className="w-full bg-black text-white py-3 text-sm font-medium rounded hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
