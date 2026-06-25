import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

export interface CartItem {
  productId: string
  variantId: string
  name: string
  image: string
  price: number
  qty: number
  handle?: string
  [key: string]: any
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

const loadCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('cart')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed.state?.items ?? parsed.items ?? []
  } catch {
    return []
  }
}

const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify({ items }))
  }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: (): CartState => ({ items: loadCart(), isOpen: false }),
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      )
      if (existing) {
        existing.qty += item.qty
      } else {
        state.items.push(item)
      }
      saveCart(state.items)
    },
    removeItem: (state, action: PayloadAction<{ productId: string; variantId: string }>) => {
      state.items = state.items.filter(
        (i) => !(i.productId === action.payload.productId && i.variantId === action.payload.variantId)
      )
      saveCart(state.items)
    },
    updateQty: (state, action: PayloadAction<{ productId: string; variantId: string; qty: number }>) => {
      const { productId, variantId, qty } = action.payload
      const item = state.items.find((i) => i.productId === productId && i.variantId === variantId)
      if (item) {
        item.qty = Math.max(1, qty)
        saveCart(state.items)
      }
    },
    clearCart: (state) => {
      state.items = []
      saveCart([])
    },
    openCart: (state) => { state.isOpen = true },
    closeCart: (state) => { state.isOpen = false },
    toggleCart: (state) => { state.isOpen = !state.isOpen },
  },
})

export const { addItem, removeItem, updateQty, clearCart, openCart, closeCart, toggleCart } = cartSlice.actions
export default cartSlice.reducer

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartIsOpen = (state: RootState) => state.cart.isOpen
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.qty, 0)
export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
