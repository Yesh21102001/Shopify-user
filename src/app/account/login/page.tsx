'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { loginUser } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

interface FormData {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(data.email, data.password)
      setUser(res.user, res.token)
      router.push('/account')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-black">Sign In</h1>
          <p className="text-subtext mt-2">Welcome back! Please sign in to your account.</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Email address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-black"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-subtext">Remember me</span>
              </label>
              <a href="#" className="text-black underline underline-offset-2">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded font-medium text-sm hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-subtext">
            Don&apos;t have an account?{' '}
            <Link href="/account/register" className="text-black font-medium underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
