import axios from 'axios'
import type { Product, Collection, Order, Review, User, BlogPost } from '@/types'

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Backend wraps all responses as { success, data, pagination? }
// Axios adds its own wrapper, so the response is: res.data = { success, data, pagination? }

// Products
export const getProducts = async (params?: Record<string, unknown>) => {
  const res = await api.get('/products', { params })
  return { products: res.data.data as Product[], total: res.data.pagination?.total ?? 0 }
}

export const getProduct = async (id: string) => {
  const res = await api.get(`/products/${id}`)
  return res.data.data as Product
}

export const getProductByHandle = async (handle: string) => {
  const res = await api.get(`/products/handle/${handle}`)
  return res.data.data as Product
}

export const getFeaturedProducts = async () => {
  const res = await api.get('/products/featured')
  return res.data.data as Product[]
}

export const getRelatedProducts = async (productId: string, limit = 4) => {
  const res = await api.get(`/products/${productId}/related`, { params: { limit } })
  return res.data.data as Product[]
}

export const searchProducts = async (query: string) => {
  const res = await api.get('/products', { params: { search: query } })
  return res.data.data as Product[]
}

// Collections
export const getCollections = async () => {
  const res = await api.get('/collections')
  return res.data.data as Collection[]
}

export const getCollectionByHandle = async (handle: string) => {
  const res = await api.get(`/collections/handle/${handle}`)
  return res.data.data as Collection
}

export const getFeaturedCollections = async () => {
  const res = await api.get('/collections/featured')
  return res.data.data as Collection[]
}

// Auth — backend returns ok({ user, token }) → { success, data: { user, token } }
export const loginUser = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password })
  return res.data.data as { user: User; token: string }
}

export const registerUser = async (name: string, email: string, password: string) => {
  const res = await api.post('/auth/register', { name, email, password })
  return res.data.data as { user: User; token: string }
}

export const getMe = async () => {
  const res = await api.get('/auth/me')
  return res.data.data as User
}

export const updateMe = async (data: Partial<User>) => {
  const res = await api.put('/auth/me', data)
  return res.data.data as User
}

// Orders
export const createOrder = async (orderData: unknown) => {
  const res = await api.post('/orders', orderData)
  return res.data.data as Order
}

export const getMyOrders = async () => {
  const res = await api.get('/orders/my')
  return res.data.data as Order[]
}

export const getOrder = async (id: string) => {
  const res = await api.get(`/orders/${id}`)
  return res.data.data as Order
}

// Wishlist
export const getWishlist = async () => {
  const res = await api.get('/wishlist')
  return res.data.data as string[]
}

export const toggleWishlist = async (productId: string) => {
  const res = await api.post('/wishlist/toggle', { productId })
  return res.data.data as string[]
}

// Reviews
export const getReviews = async (productId: string) => {
  const res = await api.get(`/reviews/${productId}`)
  return res.data.data as Review[]
}

export const createReview = async (
  productId: string,
  data: { name: string; rating: number; title: string; body: string }
) => {
  const res = await api.post(`/reviews/${productId}`, data)
  return res.data.data as Review
}

// Discounts
export const validateDiscount = async (code: string, subtotal: number) => {
  const res = await api.post('/discounts/validate', { code, subtotal })
  return res.data.data as { valid: boolean; discount: number; type: string }
}

// Blog
export const getBlogPosts = async () => {
  const res = await api.get('/blog')
  return res.data.data as BlogPost[]
}

export const getBlogPost = async (slug: string) => {
  const res = await api.get(`/blog/${slug}`)
  return res.data.data as BlogPost
}
