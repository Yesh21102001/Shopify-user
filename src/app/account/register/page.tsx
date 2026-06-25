'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { registerUser } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const router = useRouter()
  const setUser = useAuthStore((s) => s.setUser)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>()
  const password = watch('password')

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const res = await registerUser(data.name, data.email, data.password)
      setUser(res.user, res.token)
      router.push('/account')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-black">Create Account</h1>
          <p className="text-subtext mt-2">Join us for exclusive deals and a better shopping experience.</p>
        </div>

        <div className="bg-white border border-border rounded-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Full name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name is too short' } })}
                className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Email address</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
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
                  {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'At least 8 characters' } })}
                  className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-subtext hover:text-black">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1.5">Confirm password</label>
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (v) => v === password || 'Passwords do not match',
                })}
                className="w-full border border-border rounded px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="••••••••"
              />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded font-medium text-sm hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-subtext">
            Already have an account?{' '}
            <Link href="/account/login" className="text-black font-medium underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
