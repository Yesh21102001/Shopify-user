'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Share2, Truck, RotateCcw, Shield, ChevronDown, Star } from 'lucide-react'
import { getProductByHandle, getRelatedProducts, getReviews, createReview } from '@/lib/api'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import StarRating from '@/components/product/StarRating'
import VariantSelector from '@/components/product/VariantSelector'
import QuantitySelector from '@/components/product/QuantitySelector'
import ProductCard from '@/components/product/ProductCard'
import { formatPrice, getDiscount, getMainImage } from '@/lib/utils'
import type { Product, Variant, Review } from '@/types'

type TabType = 'description' | 'shipping' | 'reviews'

export default function ProductDetailPage() {
  const params = useParams()
  const handle = params?.handle as string

  const addItem = useCartStore((s) => s.addItem)
  const toggle = useWishlistStore((s) => s.toggle)
  const hasItem = useWishlistStore((s) => s.hasItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('description')
  const [mainImageIdx, setMainImageIdx] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, title: '', body: '' })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [shippingOpen, setShippingOpen] = useState(false)

  useEffect(() => {
    if (!handle) return
    setLoading(true)
    getProductByHandle(handle)
      .then((p) => {
        setProduct(p)
        const defaultOptions = p.options.reduce((acc, opt) => {
          acc[opt.name] = opt.values[0] ?? ''
          return acc
        }, {} as Record<string, string>)
        setSelectedOptions(defaultOptions)
        return Promise.all([getRelatedProducts(p._id), getReviews(p._id)])
      })
      .then(([rel, revs]) => { setRelated(rel); setReviews(revs) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [handle])

  if (loading) {
    return (
      <div className="m-container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="m-grid-story--top">
          <div style={{ aspectRatio: '3/4', background: '#f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
            {[240, 160, 80, 120, 200].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? 32 : 20, width: w, background: '#f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="m-container" style={{ paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Product Not Found</h1>
        <Link href="/products" style={{ fontSize: 14, textDecoration: 'underline', color: '#555' }}>
          ← Back to Products
        </Link>
      </div>
    )
  }

  const selectedVariant: Variant | undefined =
    product.variants.find((v) =>
      Object.entries(selectedOptions).every(([k, val]) => v.options[k] === val)
    ) ?? product.variants[0]

  const price = selectedVariant?.price ?? 0
  const compareAtPrice = selectedVariant?.compareAtPrice
  const discount = compareAtPrice ? getDiscount(price, compareAtPrice) : 0
  const inWishlist = hasItem(product._id)
  const mainImages = product.images.length > 0 ? product.images : [{ url: getMainImage([]), alt: product.title }]
  const outOfStock = selectedVariant?.stock === 0

  const handleAddToCart = () => {
    if (!selectedVariant || outOfStock) return
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
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewLoading(true)
    try {
      const review = await createReview(product._id, reviewForm)
      setReviews((prev) => [review, ...prev])
      setReviewSuccess(true)
      setReviewForm({ name: '', rating: 5, title: '', body: '' })
    } catch { /* silent */ } finally { setReviewLoading(false) }
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : (product.rating ?? 0)

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div style={{ borderBottom: '1px solid #e8e8e8', padding: '14px 0', background: '#fff' }}>
        <div className="m-container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#999' }}>
            <Link href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/products" style={{ color: '#999', textDecoration: 'none' }}>Products</Link>
            <span>/</span>
            <span style={{ color: '#000' }}>{product.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Main product section ── */}
      <div className="m-container" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <div className="m-grid-story--top">

          {/* ── LEFT: Gallery ── */}
          <div>
            {/* Main image */}
            <div style={{
              position: 'relative', aspectRatio: '3/4', overflow: 'hidden',
              background: '#f5f5f5', marginBottom: 10,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainImages[mainImageIdx]?.url ?? getMainImage(product.images)}
                alt={mainImages[mainImageIdx]?.alt ?? product.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }}
              />
              {discount > 0 && (
                <span style={{
                  position: 'absolute', top: 16, left: 16,
                  background: '#da3f3f', color: '#fff', fontSize: 11, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 11,
                }}>
                  -{discount}%
                </span>
              )}
              {outOfStock && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {mainImages.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {mainImages.map((img, i) => (
                  <button key={i} onClick={() => setMainImageIdx(i)}
                    style={{
                      width: 70, height: 88, flexShrink: 0, overflow: 'hidden', position: 'relative',
                      border: mainImageIdx === i ? '2px solid #000' : '2px solid transparent',
                      background: '#f5f5f5', cursor: 'pointer', padding: 0,
                      transition: 'border-color 0.15s',
                    }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Vendor */}
            {product.vendor && (
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', marginBottom: 10 }}>
                {product.vendor}
              </p>
            )}

            {/* Title */}
            <h1 style={{ fontSize: 'clamp(22px, 2.8vw, 32px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
              {product.title}
            </h1>

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <StarRating rating={avgRating} count={reviews.length} showCount />
              {reviews.length > 0 && (
                <button onClick={() => setActiveTab('reviews')}
                  style={{ fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', textDecoration: 'underline' }}>
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: compareAtPrice && compareAtPrice > price ? '#da3f3f' : '#000' }}>
                {formatPrice(price)}
              </span>
              {compareAtPrice && compareAtPrice > price && (
                <span style={{ fontSize: 18, color: '#bbb', textDecoration: 'line-through' }}>
                  {formatPrice(compareAtPrice)}
                </span>
              )}
              {discount > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, background: '#da3f3f', color: '#fff', padding: '3px 10px', borderRadius: 11 }}>
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.75, marginBottom: 24 }}>
                {product.shortDescription}
              </p>
            )}

            {/* Divider */}
            <div style={{ height: 1, background: '#e8e8e8', marginBottom: 24 }} />

            {/* Variants */}
            {product.options.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <VariantSelector
                  options={product.options}
                  selectedOptions={selectedOptions}
                  onChange={(name, value) => setSelectedOptions((prev) => ({ ...prev, [name]: value }))}
                  variants={product.variants}
                />
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, color: '#333' }}>
                Quantity
              </p>
              <QuantitySelector value={qty} onChange={setQty} />
            </div>

            {/* ATC + Wishlist */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                style={{
                  flex: 1, padding: '15px 24px', background: added ? '#2a7a4f' : '#000',
                  color: '#fff', border: 'none', fontSize: 13, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: outOfStock ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'background 0.2s',
                  opacity: outOfStock ? 0.5 : 1,
                }}>
                {outOfStock ? 'Out of Stock' : added ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggle(product._id)}
                style={{
                  width: 52, flexShrink: 0, border: '1px solid #e8e8e8',
                  background: inWishlist ? '#fff5f5' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s', color: inWishlist ? '#da3f3f' : '#000',
                }}
                aria-label="Add to wishlist">
                <Heart size={18} fill={inWishlist ? '#da3f3f' : 'none'} stroke={inWishlist ? '#da3f3f' : 'currentColor'} />
              </button>
            </div>

            {/* Share */}
            <button
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#888', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 24, padding: 0 }}
              onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}>
              <Share2 size={14} /> Share this product
            </button>

            {/* Shipping accordion */}
            <div style={{ border: '1px solid #e8e8e8' }}>
              {[
                { icon: <Truck size={16} />, text: 'Free shipping on orders over $75' },
                { icon: <RotateCcw size={16} />, text: 'Free returns within 30 days' },
                { icon: <Shield size={16} />, text: 'Secure & encrypted checkout' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < 2 ? '1px solid #e8e8e8' : 'none' }}>
                  <span style={{ color: '#888', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: '#555' }}>{item.text}</span>
                </div>
              ))}

              {/* Expandable shipping details */}
              <div style={{ borderTop: '1px solid #e8e8e8' }}>
                <button onClick={() => setShippingOpen(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600 }}>
                  Shipping & Returns
                  <ChevronDown size={15} style={{ transition: 'transform 0.2s', transform: shippingOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                {shippingOpen && (
                  <div style={{ padding: '4px 16px 16px', fontSize: 13, color: '#666', lineHeight: 1.75 }}>
                    <p style={{ margin: '0 0 6px' }}><strong>Standard:</strong> $5.99 · 3–5 business days</p>
                    <p style={{ margin: '0 0 6px' }}><strong>Express:</strong> $12.99 · 1–2 business days</p>
                    <p style={{ margin: 0 }}><strong>Returns:</strong> Unworn items with tags within 30 days.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginTop: 64, borderTop: '1px solid #e8e8e8', paddingTop: 48 }}>
          {/* Tab buttons */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8', marginBottom: 40, overflowX: 'auto' }}>
            {(['description', 'shipping', 'reviews'] as TabType[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '14px 28px', fontSize: 14, fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                  color: activeTab === tab ? '#000' : '#999',
                  marginBottom: -1, transition: 'color 0.15s',
                }}>
                {tab === 'reviews'
                  ? `Reviews (${reviews.length})`
                  : tab === 'shipping' ? 'Shipping & Returns'
                  : 'Description'}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'description' && (
            <div style={{ maxWidth: 760, fontSize: 15, color: '#555', lineHeight: 1.85 }}>
              <p>{product.description || 'No description available.'}</p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ maxWidth: 620 }}>
              {[
                { title: 'Free Shipping', body: 'On all orders over $75. Estimated delivery 5–7 business days.' },
                { title: 'Standard Shipping', body: '$5.99. Estimated delivery 3–5 business days.' },
                { title: 'Express Shipping', body: '$12.99. Estimated delivery 1–2 business days.' },
                { title: 'Returns', body: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, with original tags attached.' },
                { title: 'Exchanges', body: 'We are happy to exchange items for a different size or color within 30 days.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#000', marginTop: 8, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.65 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="m-grid-2">

              {/* Left: existing reviews */}
              <div>
                {reviews.length === 0 && !reviewSuccess ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#aaa' }}>
                    <Star size={32} style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', color: '#555' }}>No reviews yet</p>
                    <p style={{ fontSize: 13, margin: 0 }}>Be the first to review this product</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {reviews.map((r) => (
                      <div key={r._id} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', gap: 3 }}>
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} size={13} fill={i <= r.rating ? '#f59e0b' : 'none'} stroke={i <= r.rating ? '#f59e0b' : '#ddd'} />
                            ))}
                          </div>
                          <span style={{ fontSize: 12, color: '#bbb' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px' }}>{r.title}</p>
                        <p style={{ fontSize: 14, color: '#666', margin: '0 0 6px', lineHeight: 1.65 }}>{r.body}</p>
                        <p style={{ fontSize: 12, color: '#aaa', margin: 0 }}>— {r.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: write review form */}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, letterSpacing: '-0.01em' }}>Write a Review</h3>
                {reviewSuccess && (
                  <div style={{ background: '#f0fff8', border: '1px solid #64bf99', padding: '12px 16px', fontSize: 14, color: '#2a7a4f', marginBottom: 16 }}>
                    ✓ Thank you for your review!
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input required placeholder="Your name" value={reviewForm.name}
                    onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    style={{ border: '1px solid #e8e8e8', padding: '11px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%' }}
                    onFocus={e => (e.target.style.borderColor = '#000')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />

                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, color: '#333' }}>Rating</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                          <Star size={22} fill={n <= reviewForm.rating ? '#f59e0b' : 'none'} stroke={n <= reviewForm.rating ? '#f59e0b' : '#ddd'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input required placeholder="Review title" value={reviewForm.title}
                    onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))}
                    style={{ border: '1px solid #e8e8e8', padding: '11px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', width: '100%' }}
                    onFocus={e => (e.target.style.borderColor = '#000')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />

                  <textarea required rows={4} placeholder="Share your experience…" value={reviewForm.body}
                    onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                    style={{ border: '1px solid #e8e8e8', padding: '11px 14px', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'vertical', width: '100%', lineHeight: 1.6 }}
                    onFocus={e => (e.target.style.borderColor = '#000')}
                    onBlur={e => (e.target.style.borderColor = '#e8e8e8')} />

                  <button type="submit" disabled={reviewLoading}
                    style={{ padding: '13px 32px', background: '#000', color: '#fff', border: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: reviewLoading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: reviewLoading ? 0.6 : 1, alignSelf: 'flex-start' }}>
                    {reviewLoading ? 'Submitting…' : 'Submit Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div style={{ marginTop: 72, paddingTop: 56, borderTop: '1px solid #e8e8e8' }}>
            <div className="m-section-heading m-section-heading--centered" style={{ marginBottom: 36 }}>
              <span className="m-section-heading__subtitle">More to Explore</span>
              <h2 className="m-section-heading__title">You May Also Like</h2>
            </div>
            <div className="m-product-grid">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
