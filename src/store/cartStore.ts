import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQty: (productId: string, variantId: string, qty: number) => void
  clearCart: () => void
  open: () => void
  close: () => void
  toggle: () => void
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (productId: string, variantId: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        }))
      },

      updateQty: (productId: string, variantId: string, qty: number) => {
        const safeQty = Math.max(1, qty)
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, qty: safeQty } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.qty, 0)
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.qty, 0)
      },
    }),
    {
      name: 'cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
