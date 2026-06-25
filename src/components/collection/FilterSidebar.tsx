'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const colorSwatches = [
  { label: 'Black', value: 'black', hex: '#000000' },
  { label: 'White', value: 'white', hex: '#ffffff' },
  { label: 'Red', value: 'red', hex: '#ef4444' },
  { label: 'Blue', value: 'blue', hex: '#3b82f6' },
  { label: 'Green', value: 'green', hex: '#22c55e' },
  { label: 'Yellow', value: 'yellow', hex: '#eab308' },
  { label: 'Navy', value: 'navy', hex: '#1e3a5f' },
  { label: 'Gray', value: 'gray', hex: '#9ca3af' },
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface FiltersState {
  price?: { min: number; max: number }
  sizes?: string[]
  colors?: string[]
  tags?: string[]
}

interface FilterSidebarProps {
  filters: FiltersState
  onChange: (filters: FiltersState) => void
  onClear: () => void
  availableTags?: string[]
}

function AccordionSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-[#e8e8e8] py-4">
      <button
        className="flex items-center justify-between w-full text-sm font-semibold"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function FilterSidebar({
  filters,
  onChange,
  onClear,
  availableTags = [],
}: FilterSidebarProps) {
  const hasFilters =
    (filters.price && (filters.price.min > 0 || filters.price.max > 0)) ||
    (filters.sizes && filters.sizes.length > 0) ||
    (filters.colors && filters.colors.length > 0) ||
    (filters.tags && filters.tags.length > 0)

  const toggleArr = (key: 'sizes' | 'colors' | 'tags', value: string) => {
    const arr = (filters[key] ?? []) as string[]
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
    onChange({ ...filters, [key]: next })
  }

  return (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm uppercase tracking-wider">Filters</h3>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-gray-500 hover:text-black underline transition"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price */}
      <AccordionSection title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.price?.min ?? ''}
            onChange={(e) =>
              onChange({
                ...filters,
                price: { min: Number(e.target.value), max: filters.price?.max ?? 0 },
              })
            }
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-black"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.price?.max ?? ''}
            onChange={(e) =>
              onChange({
                ...filters,
                price: { min: filters.price?.min ?? 0, max: Number(e.target.value) },
              })
            }
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-black"
          />
        </div>
      </AccordionSection>

      {/* Size */}
      <AccordionSection title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = filters.sizes?.includes(size)
            return (
              <button
                key={size}
                onClick={() => toggleArr('sizes', size)}
                className={`px-3 py-1 text-xs border rounded transition ${
                  active
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </AccordionSection>

      {/* Color */}
      <AccordionSection title="Color">
        <div className="flex flex-wrap gap-2">
          {colorSwatches.map((c) => {
            const active = filters.colors?.includes(c.value)
            return (
              <button
                key={c.value}
                onClick={() => toggleArr('colors', c.value)}
                title={c.label}
                className={`w-6 h-6 rounded-full border-2 transition ${
                  active ? 'border-black ring-2 ring-offset-1 ring-black' : 'border-gray-300'
                }`}
                style={{
                  backgroundColor: c.hex,
                  borderColor: c.hex === '#ffffff' ? '#e5e7eb' : c.hex,
                }}
              />
            )
          })}
        </div>
      </AccordionSection>

      {/* Tags */}
      {availableTags.length > 0 && (
        <AccordionSection title="Tags" defaultOpen={false}>
          <div className="space-y-2">
            {availableTags.map((tag) => {
              const active = filters.tags?.includes(tag)
              return (
                <label key={tag} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!active}
                    onChange={() => toggleArr('tags', tag)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize">{tag}</span>
                </label>
              )
            })}
          </div>
        </AccordionSection>
      )}
    </aside>
  )
}
