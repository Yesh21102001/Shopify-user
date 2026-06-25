import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'

// Backend wraps all responses as { success: true, data, pagination? }
const unwrap = (res: any) => res.data
const unwrapPaginated = (res: any) => ({ items: res.data, pagination: res.pagination })

export const frontendApi = createApi({
  reducerPath: 'frontendApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Product', 'Collection', 'Order', 'Wishlist', 'Review', 'Blog', 'User'],
  endpoints: (builder) => ({

    // ── Products ──────────────────────────────────────────────────────
    getProducts: builder.query<{ items: any[]; pagination: any }, any>({
      query: (params) => ({ url: '/products', params }),
      transformResponse: unwrapPaginated,
      providesTags: ['Product'],
    }),
    getProduct: builder.query<any, string>({
      query: (id) => `/products/${id}`,
      transformResponse: unwrap,
      providesTags: ['Product'],
    }),
    getProductByHandle: builder.query<any, string>({
      query: (handle) => `/products/handle/${handle}`,
      transformResponse: unwrap,
      providesTags: ['Product'],
    }),
    getFeaturedProducts: builder.query<any[], void>({
      query: () => '/products/featured',
      transformResponse: unwrap,
      providesTags: ['Product'],
    }),
    getRelatedProducts: builder.query<any[], { id: string; limit?: number }>({
      query: ({ id, limit = 4 }) => `/products/${id}/related?limit=${limit}`,
      transformResponse: unwrap,
      providesTags: ['Product'],
    }),
    searchProducts: builder.query<any[], string>({
      query: (q) => `/products?search=${encodeURIComponent(q)}`,
      transformResponse: unwrap,
      providesTags: ['Product'],
    }),

    // ── Collections ───────────────────────────────────────────────────
    getCollections: builder.query<any[], void>({
      query: () => '/collections',
      transformResponse: unwrap,
      providesTags: ['Collection'],
    }),
    getCollection: builder.query<any, string>({
      query: (id) => `/collections/${id}`,
      transformResponse: unwrap,
      providesTags: ['Collection'],
    }),
    getCollectionByHandle: builder.query<any, string>({
      query: (handle) => `/collections/handle/${handle}`,
      transformResponse: unwrap,
      providesTags: ['Collection'],
    }),
    getFeaturedCollections: builder.query<any[], void>({
      query: () => '/collections/featured',
      transformResponse: unwrap,
      providesTags: ['Collection'],
    }),

    // ── Auth ──────────────────────────────────────────────────────────
    login: builder.mutation<{ user: any; token: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: unwrap,
    }),
    register: builder.mutation<{ user: any; token: string }, { name: string; email: string; password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: unwrap,
    }),
    getMe: builder.query<any, void>({
      query: () => '/auth/me',
      transformResponse: unwrap,
      providesTags: ['User'],
    }),
    changePassword: builder.mutation<any, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),
    updateProfile: builder.mutation<any, any>({
      query: (body) => ({ url: '/users/me', method: 'PUT', body }),
      transformResponse: unwrap,
      invalidatesTags: ['User'],
    }),

    // ── Orders ────────────────────────────────────────────────────────
    getMyOrders: builder.query<any[], void>({
      query: () => '/orders',
      transformResponse: unwrap,
      providesTags: ['Order'],
    }),
    getOrder: builder.query<any, string>({
      query: (id) => `/orders/${id}`,
      transformResponse: unwrap,
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<any, any>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Order'],
    }),

    // ── Wishlist ──────────────────────────────────────────────────────
    getWishlist: builder.query<any, void>({
      query: () => '/users/wishlist',
      transformResponse: unwrap,
      providesTags: ['Wishlist'],
    }),
    toggleWishlist: builder.mutation<any, string>({
      query: (productId) => ({ url: `/users/wishlist/${productId}`, method: 'POST' }),
      transformResponse: unwrap,
      invalidatesTags: ['Wishlist'],
    }),

    // ── Reviews ───────────────────────────────────────────────────────
    getReviews: builder.query<any[], string>({
      query: (productId) => `/reviews/${productId}`,
      transformResponse: unwrap,
      providesTags: ['Review'],
    }),
    createReview: builder.mutation<any, { productId: string; rating: number; comment: string }>({
      query: ({ productId, ...body }) => ({ url: `/reviews/${productId}`, method: 'POST', body }),
      transformResponse: unwrap,
      invalidatesTags: ['Review'],
    }),

    // ── Blog ──────────────────────────────────────────────────────────
    getBlogPosts: builder.query<any[], void>({
      query: () => '/blog',
      transformResponse: unwrap,
      providesTags: ['Blog'],
    }),
    getBlogPost: builder.query<any, string>({
      query: (slug) => `/blog/${slug}`,
      transformResponse: unwrap,
      providesTags: ['Blog'],
    }),

    // ── Discounts ─────────────────────────────────────────────────────
    validateDiscount: builder.mutation<any, { code: string; subtotal: number }>({
      query: (body) => ({ url: '/discounts/validate', method: 'POST', body }),
      transformResponse: unwrap,
    }),
  }),
})

export const {
  // Products
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductByHandleQuery,
  useGetFeaturedProductsQuery,
  useGetRelatedProductsQuery,
  useSearchProductsQuery,
  // Collections
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useGetCollectionByHandleQuery,
  useGetFeaturedCollectionsQuery,
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  // Orders
  useGetMyOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  // Wishlist
  useGetWishlistQuery,
  useToggleWishlistMutation,
  // Reviews
  useGetReviewsQuery,
  useCreateReviewMutation,
  // Blog
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  // Discounts
  useValidateDiscountMutation,
} = frontendApi
