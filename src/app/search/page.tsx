'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { searchProducts } from '@/lib/api'
import ProductCard from '@/components/product/ProductCard'
import type { Product } from '@/types'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [input, setInput] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) { setProducts([]); setTotal(0); return }
    setLoading(true)
    searchProducts(query)
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setTotal(Array.isArray(data) ? data.length : 0)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) router.push(`/search?q=${encodeURIComponent(input.trim())}`)
  }

  return (
    <div className="container py-12">
      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for products…"
            className="w-full border-2 border-border rounded-full pl-12 pr-12 py-3.5 text-base focus:outline-none focus:border-black transition-colors"
          />
          {input && (
            <button type="button" onClick={() => { setInput(''); router.push('/search') }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext hover:text-black">
              <X size={18} />
            </button>
          )}
        </form>
      </div>

      {/* Results header */}
      {query && (
        <div className="mb-6 text-center">
          {loading ? (
            <p className="text-subtext">Searching for &ldquo;{query}&rdquo;…</p>
          ) : (
            <p className="text-subtext">
              {total > 0
                ? <>Found <strong className="text-black">{total}</strong> result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</>
                : <>No results found for &ldquo;{query}&rdquo;</>
              }
            </p>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-100 rounded mb-3" />
              <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Products */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}

      {/* No results */}
      {!loading && query && products.length === 0 && (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto text-gray-200 mb-5" />
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-subtext mb-6">Try a different search term or browse our collections.</p>
          <Link href="/products" className="bg-black text-white px-8 py-3 rounded font-medium text-sm hover:bg-primary-hover transition-colors">
            Browse All Products
          </Link>
        </div>
      )}

      {/* Empty state (no query) */}
      {!query && !loading && (
        <div className="text-center py-16 text-subtext">
          <p>Enter a search term above to find products.</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center text-subtext">Loading…</div>}>
      <SearchResults />
    </Suspense>
  )
}
