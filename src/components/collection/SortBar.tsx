'use client'

import { LayoutGrid, Grid2X2 } from 'lucide-react'

const sortOptions = [
  { value: '', label: 'Sort: Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
]

interface SortBarProps {
  total: number
  sort: string
  onSortChange: (sort: string) => void
  gridCols: 2 | 4
  onGridChange: (cols: 2 | 4) => void
}

export default function SortBar({ total, sort, onSortChange, gridCols, onGridChange }: SortBarProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#e8e8e8] mb-5">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-black">{total}</span> products
      </p>
      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-black transition"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 border border-gray-300 rounded overflow-hidden">
          <button
            onClick={() => onGridChange(4)}
            className={`p-1.5 transition ${
              gridCols === 4 ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
            aria-label="4 column grid"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onGridChange(2)}
            className={`p-1.5 transition ${
              gridCols === 2 ? 'bg-black text-white' : 'hover:bg-gray-100'
            }`}
            aria-label="2 column grid"
          >
            <Grid2X2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
