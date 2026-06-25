import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

interface WishlistState {
  productIds: string[]
}

const loadWishlist = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('wishlist')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed.state?.productIds ?? parsed.productIds ?? []
  } catch {
    return []
  }
}

const saveWishlist = (ids: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('wishlist', JSON.stringify({ productIds: ids }))
  }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: (): WishlistState => ({ productIds: loadWishlist() }),
  reducers: {
    addToWishlist: (state, action: PayloadAction<string>) => {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload)
        saveWishlist(state.productIds)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.productIds = state.productIds.filter((id) => id !== action.payload)
      saveWishlist(state.productIds)
    },
    toggleWishlistItem: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.productIds.includes(id)) {
        state.productIds = state.productIds.filter((p) => p !== id)
      } else {
        state.productIds.push(id)
      }
      saveWishlist(state.productIds)
    },
  },
})

export const { addToWishlist, removeFromWishlist, toggleWishlistItem } = wishlistSlice.actions
export default wishlistSlice.reducer

// Selectors
export const selectWishlistIds = (state: RootState) => state.wishlist.productIds
export const selectIsInWishlist = (productId: string) => (state: RootState) =>
  state.wishlist.productIds.includes(productId)
