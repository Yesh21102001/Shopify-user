'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { getCollectionByHandle, getProducts } from '@/lib/api'
import Breadcrumb from '@/components/ui/Breadcrumb'
import FilterSidebar from '@/components/collection/FilterSidebar'
import SortBar from '@/components/collection/SortBar'
import ProductGrid from '@/components/product/ProductGrid'
import Pagination from '@/components/ui/Pagination'
import type { Collection, Product } from '@/types'

const PER_PAGE = 12

interface Filters {
  price?: { min: number; max: number }
  sizes?: string[]
  colors?: string[]
  tags?: string[]
}

function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0))
    case 'price-desc':
      return sorted.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0))
    case 'name-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'name-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    default:
      return sorted
  }
}

function applyFilters(products: Product[], filters: Filters): Product[] {
  return products.filter((p) => {
    const price = p.variants[0]?.price ?? 0
    if (filters.price?.min && price < filters.price.min) return false
    if (filters.price?.max && filters.price.max > 0 && price > filters.price.max) return false
    if (filters.sizes && filters.sizes.length > 0) {
      const hasSizeOption = p.options.find((o) => o.name.toLowerCase() === 'size')
      if (!hasSizeOption) return false
      const productSizes = hasSizeOption.values
      if (!filters.sizes.some((s) => productSizes.includes(s))) return false
    }
    if (filters.colors && filters.colors.length > 0) {
      const hasColorOption = p.options.find((o) => o.name.toLowerCase() === 'color')
      if (!hasColorOption) return false
      const productColors = hasColorOption.values.map((v) => v.toLowerCase())
      if (!filters.colors.some((c) => productColors.includes(c.toLowerCase()))) return false
    }
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some((t) => p.tags.includes(t))) return false
    }
    return true
  })
}

export default function CollectionPage() {
  const params = useParams()
  const handle = params?.handle as string

  const [collection, setCollection] = useState<Collection | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({})
  const [sort, setSort] = useState('')
  const [gridCols, setGridCols] = useState<2 | 4>(4)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!handle) return
    setLoading(true)
    getCollectionByHandle(handle)
      .then((col) => {
        setCollection(col)
        return getProducts({ collection: handle })
      })
      .then((data) => {
        setAllProducts(data.products)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [handle])

  const filteredProducts = useMemo(() => {
    const filtered = applyFilters(allProducts, filters)
    return sortProducts(filtered, sort)
  }, [allProducts, filters, sort])

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE)
  const paginatedProducts = filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    allProducts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
    return Array.from(tagSet)
  }, [allProducts])

  return (
    <div className="container mx-auto px-4 max-w-[1200px] py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: collection?.title ?? handle },
        ]}
      />

      <div className="mt-6 mb-6">
        <h1 className="text-2xl font-bold mb-1">{collection?.title ?? handle}</h1>
        {collection?.description && (
          <p className="text-gray-500 text-sm">{collection.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{filteredProducts.length} products</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <FilterSidebar
            filters={filters}
            onChange={(f) => { setFilters(f); setPage(1) }}
            onClear={() => { setFilters({}); setPage(1) }}
            availableTags={allTags}
          />
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <SortBar
            total={filteredProducts.length}
            sort={sort}
            onSortChange={(s) => { setSort(s); setPage(1) }}
            gridCols={gridCols}
            onGridChange={setGridCols}
          />
          <ProductGrid products={paginatedProducts} loading={loading} cols={gridCols} />
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
