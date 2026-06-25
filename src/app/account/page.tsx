'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getMe, updateMe } from '@/lib/api'
import { useForm } from 'react-hook-form'

interface ProfileForm {
  name: string
  email: string
  phone: string
}

export default function AccountPage() {
  const router = useRouter()
  const { user, token, setUser, logout } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, reset } = useForm<ProfileForm>()

  useEffect(() => {
    if (!token) { router.push('/account/login'); return }
    getMe()
      .then((u) => {
        setUser(u, token)
        reset({ name: u.name, email: u.email, phone: u.phone || '' })
      })
      .catch(() => { logout(); router.push('/account/login') })
      .finally(() => setLoading(false))
  }, [token])

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true)
    try {
      const u = await updateMe(data)
      setUser(u, token!)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-12 max-w-5xl">
      <h1 className="text-2xl font-medium mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="bg-white border border-border rounded-lg overflow-hidden">
            <div className="p-5 border-b border-border bg-gray-50">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-medium mb-3">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-xs text-subtext truncate">{user?.email}</p>
            </div>
            <nav className="py-2">
              {[
                { href: '/account', label: 'Profile', icon: <User size={16} /> },
                { href: '/account/orders', label: 'My Orders', icon: <Package size={16} /> },
                { href: '/wishlist', label: 'Wishlist', icon: <MapPin size={16} /> },
              ].map(({ href, label, icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 transition-colors"
                >
                  <span className="text-subtext">{icon}</span>
                  {label}
                  <ChevronRight size={14} className="ml-auto text-subtext" />
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3 text-sm hover:bg-gray-50 transition-colors text-left text-red-500"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-5">Personal Information</h2>
            {saved && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                Profile updated successfully!
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full name</label>
                  <input
                    {...register('name', { required: true })}
                    className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone</label>
                  <input
                    {...register('phone')}
                    className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email address</label>
                <input
                  type="email"
                  {...register('email', { required: true })}
                  className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-medium mb-2">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Link href="/account/orders" className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-black transition-colors">
                <Package size={20} />
                <span className="text-sm font-medium">View Orders</span>
              </Link>
              <Link href="/wishlist" className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-black transition-colors">
                <MapPin size={20} />
                <span className="text-sm font-medium">My Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
