'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { useGetProductsQuery } from '@/store/api/frontendApi'
import type { Product } from '@/types'
import FilterSidebar from '@/components/collection/FilterSidebar'
import SortBar from '@/components/collection/SortBar'
import ProductGrid from '@/components/product/ProductGrid'
import Pagination from '@/components/ui/Pagination'

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
    case 'price-asc':  return sorted.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0))
    case 'price-desc': return sorted.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0))
    case 'name-asc':   return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'name-desc':  return sorted.sort((a, b) => b.title.localeCompare(a.title))
    case 'newest':     return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    default: return sorted
  }
}

function applyFilters(products: Product[], filters: Filters): Product[] {
  return products.filter((p) => {
    const price = p.variants[0]?.price ?? 0
    if (filters.price?.min && price < filters.price.min) return false
    if (filters.price?.max && filters.price.max > 0 && price > filters.price.max) return false
    if (filters.sizes?.length) {
      const sizeOpt = p.options.find((o) => o.name.toLowerCase() === 'size')
      if (!sizeOpt || !filters.sizes!.some((s) => sizeOpt.values.includes(s))) return false
    }
    if (filters.colors?.length) {
      const colorOpt = p.options.find((o) => o.name.toLowerCase() === 'color')
      if (!colorOpt || !filters.colors!.some((c) => colorOpt.values.map(v => v.toLowerCase()).includes(c.toLowerCase()))) return false
    }
    if (filters.tags?.length) {
      if (!filters.tags.some((t) => p.tags.includes(t))) return false
    }
    return true
  })
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { data: productsData, isLoading: loading } = useGetProductsQuery({ limit: 200 })
  const allProducts = productsData?.items ?? []

  const [filters, setFilters] = useState<Filters>({})
  const [sort, setSort] = useState(searchParams.get('sort') ?? '')
  const [gridCols, setGridCols] = useState<2 | 4>(4)
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '1'))
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // lock body scroll when mobile filter open
  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileFilterOpen])

  const filteredProducts = useMemo(() => sortProducts(applyFilters(allProducts, filters), sort), [allProducts, filters, sort])
  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE)
  const paginatedProducts = filteredProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const allTags = useMemo(() => {
    const s = new Set<string>()
    allProducts.forEach((p) => p.tags.forEach((t) => s.add(t)))
    return Array.from(s)
  }, [allProducts])

  const activeFilterCount =
    (filters.sizes?.length ?? 0) +
    (filters.colors?.length ?? 0) +
    (filters.tags?.length ?? 0) +
    (filters.price?.min || filters.price?.max ? 1 : 0)

  const handlePageChange = (p: number) => {
    setPage(p)
    router.push(`/products?page=${p}&sort=${sort}`, { scroll: true })
  }
  const handleSortChange = (s: string) => {
    setSort(s); setPage(1)
    router.push(`/products?page=1&sort=${s}`)
  }

  return (
    <>
      {/* ── Page Hero ── */}
      <div style={{ background: '#f9f9f9', borderBottom: '1px solid #e8e8e8', padding: '36px 0' }}>
        <div className="m-container">
          <nav style={{ fontSize: 13, color: '#999', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Home</a>
            <span>/</span>
            <span style={{ color: '#000' }}>All Products</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>All Products</h1>
            </div>
            {!loading && (
              <span style={{ fontSize: 13, color: '#999' }}>{filteredProducts.length} products</span>
            )}
          </div>
        </div>
      </div>

      <div className="m-container" style={{ paddingTop: 32, paddingBottom: 72 }}>

        {/* Mobile filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e8e8e8' }}
          className="lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', border: '1px solid #e8e8e8', background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            <SlidersHorizontal size={15} />
            Filter
            {activeFilterCount > 0 && (
              <span style={{ background: '#000', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          <select value={sort} onChange={(e) => handleSortChange(e.target.value)}
            style={{ fontSize: 13, border: '1px solid #e8e8e8', padding: '9px 12px', outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
            {[
              { value: '', label: 'Default' },
              { value: 'price-asc', label: 'Price: Low → High' },
              { value: 'price-desc', label: 'Price: High → Low' },
              { value: 'newest', label: 'Newest First' },
              { value: 'name-asc', label: 'Name A → Z' },
            ].map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Desktop layout */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {/* Sidebar — desktop only */}
          <aside style={{ width: 240, flexShrink: 0 }} className="hidden lg:block">
            <div style={{ position: 'sticky', top: 90 }}>
              <FilterSidebar
                filters={filters}
                onChange={(f) => { setFilters(f); setPage(1) }}
                onClear={() => { setFilters({}); setPage(1) }}
                availableTags={allTags}
              />
            </div>
          </aside>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Sort bar — desktop */}
            <div className="hidden lg:block">
              <SortBar
                total={filteredProducts.length}
                sort={sort}
                onSortChange={handleSortChange}
                gridCols={gridCols}
                onGridChange={setGridCols}
              />
            </div>

            <ProductGrid products={paginatedProducts} loading={loading} cols={gridCols} />
            <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {mobileFilterOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileFilterOpen(false)} />
          <aside style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: '#fff', maxHeight: '85vh', overflowY: 'auto',
            borderRadius: '16px 16px 0 0', padding: '0 20px 32px',
            animation: 'slideUpDrawer 0.28s ease',
          }}>
            <style>{`@keyframes slideUpDrawer{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 16px', borderBottom: '1px solid #e8e8e8', marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </span>
              <button onClick={() => setMobileFilterOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} />
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onChange={(f) => { setFilters(f); setPage(1) }}
              onClear={() => { setFilters({}); setPage(1) }}
              availableTags={allTags}
            />
            <button onClick={() => setMobileFilterOpen(false)}
              style={{ marginTop: 20, width: '100%', background: '#000', color: '#fff', border: 'none', padding: '14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em' }}>
              Show {filteredProducts.length} Products
            </button>
          </aside>
        </div>
      )}
    </>
  )
}
