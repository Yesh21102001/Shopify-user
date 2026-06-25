'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCart } from '@/store/slices/cartSlice'
import { selectCartItemCount, selectIsAuthenticated, selectCurrentUser } from '@/store'
import Link from 'next/link'
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  User,
  Heart,
  ChevronDown,
  Bell,
} from 'lucide-react'

export default function Header() {
  const dispatch = useDispatch()
  const cartCount = useSelector(selectCartItemCount)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const user = useSelector(selectCurrentUser)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchFocus, setSearchFocus] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)

  const categories = [
    {
      name: 'Women',
      subcategories: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories'],
    },
    {
      name: 'Men',
      subcategories: ['Shirts', 'Pants', 'Jackets', 'Shoes', 'Accessories', 'Activewear'],
    },
    {
      name: 'Collection',
      subcategories: ['New Arrivals', 'Best Sellers', 'Sale', 'Trending', 'Limited Edition'],
    },
    {
      name: 'About',
      subcategories: ['Our Story', 'Sustainability', 'Contact', 'Blog'],
    },
  ]

  const handleCategoryHover = (categoryName) => {
    setActiveCategory(categoryName)
  }

  const handleCategoryLeave = () => {
    setActiveCategory(null)
  }

  return (
    <>
      {announcementVisible && (
        <div className="bg-black text-white text-center py-2 text-sm flex items-center justify-between px-4">
          <span>Free shipping on orders over $100</span>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="text-white hover:text-gray-300"
            aria-label="Close announcement"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-black">Minimog</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 flex-1 ml-12">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="relative group"
                  onMouseEnter={() => handleCategoryHover(category.name)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-black py-4 text-sm font-medium transition-colors">
                    <span>{category.name}</span>
                    {category.subcategories.length > 0 && (
                      <ChevronDown size={16} className="opacity-50" />
                    )}
                  </button>

                  {category.subcategories.length > 0 && (
                    <div className="absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-md py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/category/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 text-sm"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="hidden md:flex items-center flex-1 ml-8">
              <div
                className={`relative w-full max-w-xs transition-all duration-200 ${
                  searchFocus ? 'scale-105' : ''
                }`}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  onFocus={() => setSearchFocus(true)}
                  onBlur={() => setSearchFocus(false)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/20 transition-colors"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 md:space-x-6">
              <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search size={20} className="text-gray-700" />
              </button>

              <Link
                href={isAuthenticated ? '/account' : '/login'}
                className="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-black transition-colors"
              >
                <User size={20} />
                <span className="text-sm hidden lg:inline">
                  {isAuthenticated ? user?.name?.split(' ')[0] || 'Account' : 'Login'}
                </span>
              </Link>

              <button className="hidden sm:block p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Heart size={20} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </button>

              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-gray-700" />
                ) : (
                  <Menu size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden bg-gray-50 border-t border-gray-200 py-4 space-y-1">
              {categories.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 flex items-center justify-between font-medium"
                  >
                    <span>{category.name}</span>
                    {category.subcategories.length > 0 && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          activeCategory === category.name ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {activeCategory === category.name && category.subcategories.length > 0 && (
                    <div className="bg-white pl-4">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          href={`/category/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-50 text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href={isAuthenticated ? '/account' : '/login'}
                className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}` : 'Login / Sign Up'}
              </Link>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
