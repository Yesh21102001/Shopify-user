import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role?: string
  [key: string]: any
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const loadFromStorage = (): AuthState => {
  if (typeof window === 'undefined') return { user: null, token: null, isAuthenticated: false }
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return { user: null, token: null, isAuthenticated: false }
    const parsed = JSON.parse(raw)
    return {
      user: parsed.user ?? null,
      token: parsed.token ?? null,
      isAuthenticated: !!parsed.token,
    }
  } catch {
    return { user: null, token: null, isAuthenticated: false }
  }
}

const initialState: AuthState = loadFromStorage()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('auth', JSON.stringify({ user: action.payload.user, token: action.payload.token }))
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('auth')
      }
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth', JSON.stringify({ user: state.user, token: state.token }))
        }
      }
    },
  },
})

export const { setCredentials, logout, updateUser } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectToken = (state: RootState) => state.auth.token
