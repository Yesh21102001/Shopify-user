import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  productIds: string[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  hasItem: (productId: string) => boolean
  toggle: (productId: string) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addItem: (productId: string) => {
        set((state) => {
          if (state.productIds.includes(productId)) return state
          return { productIds: [...state.productIds, productId] }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        }))
      },

      hasItem: (productId: string) => {
        return get().productIds.includes(productId)
      },

      toggle: (productId: string) => {
        const { hasItem, addItem, removeItem } = get()
        if (hasItem(productId)) {
          removeItem(productId)
        } else {
          addItem(productId)
        }
      },
    }),
    { name: 'wishlist' }
  )
)
