'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useNotificationStore } from '@/lib/store/notification'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const showNotification = useNotificationStore(state => state.showNotification)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name')
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to register')
      }

      showNotification('Account created successfully! Please log in.', 'success')
      router.push('/login')
    } catch (error: unknown) {
      showNotification(
        error instanceof Error ? error.message : 'An unexpected error occurred',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 