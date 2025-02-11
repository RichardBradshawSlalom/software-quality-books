'use client'

import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { LoginSchema } from '@/lib/validations/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('[LOG] - Form submitted')
    setError('')
    setFieldErrors({})
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Validate using Zod schema
    const result = LoginSchema.safeParse({ email, password })
    if (!result.success) {
      console.log('[LOG] - Validation errors:', result.error.errors)
      const errors = result.error.errors.reduce((acc, curr) => {
        acc[curr.path[0] as 'email' | 'password'] = curr.message
        return acc
      }, {} as { email?: string; password?: string })

      setFieldErrors(errors)
      setLoading(false)
      return
    }

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      console.log('[LOG] - Sign in response:', res)

      if (res?.error) {
        console.error('[ERROR] - Sign in error:', res.error)
        throw new Error(res.error)
      }

      const callbackUrl = searchParams.get('callbackUrl') || '/books'
      console.log('[LOG] - Sign in successful, redirecting to:', callbackUrl)
      router.push(callbackUrl)
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('[ERROR] - Error during sign in:', error.message)
        setError(error.message)
      } else {
        console.error('[ERROR] - Unexpected error during sign in')
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
      console.log('[LOG] - Form submission completed, setting loading to false')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
      <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold bg-red-700 pb-52 text-gray-900">Time to review a book!</h2>
        </div>
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">Please sign in</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input id="email" name="email" type="email" className="w-full px-3 py-2 border rounded-lg" />
              {fieldErrors.email && <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input id="password" name="password" type="password" className="w-full px-3 py-2 border rounded-lg" />
              {fieldErrors.password && <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm">
          Need an account?
          <Link href="/register" className="text-blue-500 hover:underline pl-3">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
