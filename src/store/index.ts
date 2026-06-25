import { configureStore } from '@reduxjs/toolkit'
import { frontendApi } from './api/frontendApi'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'

export const store = configureStore({
  reducer: {
    [frontendApi.reducerPath]: frontendApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(frontendApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
