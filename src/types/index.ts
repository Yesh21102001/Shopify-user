export interface Variant {
  _id: string
  title: string
  price: number
  compareAtPrice?: number
  sku: string
  stock: number
  options: Record<string, string>
}

export interface ProductImage {
  url: string
  alt: string
}

export interface ProductOption {
  name: string
  values: string[]
}

export interface Product {
  _id: string
  title: string
  handle: string
  description: string
  shortDescription?: string
  vendor?: string
  type?: string
  tags: string[]
  status: 'active' | 'draft' | 'archived'
  images: ProductImage[]
  variants: Variant[]
  options: ProductOption[]
  collections: string[]
  rating?: number
  reviewCount?: number
  featured?: boolean
  createdAt: string
}

export interface Collection {
  _id: string
  title: string
  handle: string
  description?: string
  image?: string
  products: string[]
  featured?: boolean
  status: 'active' | 'draft'
}

export interface OrderItem {
  productId: string
  title: string
  image: string
  variantTitle: string
  price: number
  qty: number
}

export interface Address {
  name: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export interface Order {
  _id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discountAmount: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress: Address
  createdAt: string
}

export interface Review {
  _id: string
  name: string
  rating: number
  title: string
  body: string
  createdAt: string
}

export interface CartItem {
  productId: string
  variantId: string
  title: string
  image: string
  variantTitle: string
  price: number
  qty: number
  handle: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  avatar?: string
}

export interface BlogPost {
  _id: string
  slug: string
  title: string
  excerpt: string
  body: string
  image?: { url: string; alt: string }
  author: string
  category?: string
  tags: string[]
  publishedAt?: string
  status?: 'published' | 'draft'
  createdAt: string
}
