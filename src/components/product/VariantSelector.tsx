'use client'

import type { Variant } from '@/types'

const colorMap: Record<string, string> = {
  black: '#000000', white: '#ffffff', red: '#ef4444', blue: '#3b82f6',
  green: '#22c55e', yellow: '#eab308', purple: '#a855f7', pink: '#ec4899',
  orange: '#f97316', gray: '#9ca3af', grey: '#9ca3af', navy: '#1e3a5f',
  brown: '#92400e', beige: '#d4b896', cream: '#f5f0e8', gold: '#d4af37', silver: '#c0c0c0',
}

interface VariantSelectorProps {
  options: { name: string; values: string[] }[]
  selectedOptions: Record<string, string>
  onChange: (name: string, value: string) => void
  variants: Variant[]
}

export default function VariantSelector({ options, selectedOptions, onChange, variants }: VariantSelectorProps) {
  const isOutOfStock = (optionName: string, value: string) =>
    variants.filter((v) => v.options[optionName] === value).every((v) => v.stock === 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {options.map((option) => {
        const isColor = option.name.toLowerCase() === 'color'
        const selected = selectedOptions[option.name]

        return (
          <div key={option.name}>
            {/* Label row */}
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, color: '#333' }}>
              {option.name}
              {selected && (
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#888', marginLeft: 8 }}>
                  : {selected}
                </span>
              )}
            </p>

            {isColor ? (
              /* ── Color swatches ── */
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {option.values.map((value) => {
                  const hex = colorMap[value.toLowerCase()] ?? '#cccccc'
                  const active = selected === value
                  const oos = isOutOfStock(option.name, value)
                  return (
                    <button
                      key={value}
                      title={value}
                      onClick={() => !oos && onChange(option.name, value)}
                      disabled={oos}
                      style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: hex,
                        border: hex === '#ffffff' ? '1px solid #e5e7eb' : '1px solid transparent',
                        outline: active ? '2px solid #000' : 'none',
                        outlineOffset: 2,
                        cursor: oos ? 'not-allowed' : 'pointer',
                        opacity: oos ? 0.35 : 1,
                        position: 'relative', flexShrink: 0,
                        transition: 'outline 0.15s, transform 0.15s',
                        transform: active ? 'scale(1.1)' : 'scale(1)',
                      }}
                      aria-label={value}
                      aria-pressed={active}
                    />
                  )
                })}
              </div>
            ) : (
              /* ── Size / other pills ── */
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {option.values.map((value) => {
                  const active = selected === value
                  const oos = isOutOfStock(option.name, value)
                  return (
                    <button
                      key={value}
                      onClick={() => !oos && onChange(option.name, value)}
                      disabled={oos}
                      style={{
                        minWidth: 44, height: 44, padding: '0 14px',
                        background: active ? '#000' : '#fff',
                        color: active ? '#fff' : oos ? '#ccc' : '#000',
                        border: active ? '1px solid #000' : '1px solid #e8e8e8',
                        fontSize: 13, fontWeight: active ? 700 : 400,
                        cursor: oos ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit',
                        textDecoration: oos ? 'line-through' : 'none',
                        transition: 'all 0.15s',
                        position: 'relative',
                      }}
                      onMouseEnter={e => { if (!active && !oos) (e.currentTarget as HTMLButtonElement).style.borderColor = '#000' }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = '#e8e8e8' }}
                      aria-pressed={active}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
