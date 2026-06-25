'use client'

import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const decrement = () => onChange(Math.max(min, value - 1))
  const increment = () => onChange(Math.min(max, value + 1))

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: 44, height: 44,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'none', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? '#ccc' : '#000', transition: 'background 0.15s', flexShrink: 0,
  })

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e8e8e8' }}>
      <button
        onClick={decrement}
        disabled={value <= min}
        style={btnStyle(value <= min)}
        aria-label="Decrease quantity"
        onMouseEnter={e => { if (value > min) (e.currentTarget as HTMLButtonElement).style.background = '#f5f5f5' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
      >
        <Minus size={14} />
      </button>

      <span style={{
        width: 48, textAlign: 'center', fontSize: 15, fontWeight: 600,
        borderLeft: '1px solid #e8e8e8', borderRight: '1px solid #e8e8e8',
        lineHeight: '44px', userSelect: 'none',
      }}>
        {value}
      </span>

      <button
        onClick={increment}
        disabled={value >= max}
        style={btnStyle(value >= max)}
        aria-label="Increase quantity"
        onMouseEnter={e => { if (value < max) (e.currentTarget as HTMLButtonElement).style.background = '#f5f5f5' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
