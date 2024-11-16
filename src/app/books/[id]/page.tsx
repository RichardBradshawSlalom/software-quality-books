// app/books/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Book } from '@/types/book'

interface BookState {
  book: Book | null
  isLoading: boolean
  error: string | null
}

export default function BookPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [state, setState] = useState<BookState>({
    book: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${params.id}`)
        if (res.status === 404) {
          router.push('/404')
          return
        }
        if (!res.ok) throw new Error('Failed to fetch book')
        const data = await res.json()
        setState(prev => ({ ...prev, book: data, isLoading: false }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An error occurred',
          isLoading: false
        }))
      }
    }

    fetchBook()
  }, [params.id, router])

  if (state.isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{state.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!state.book) return null

  return (
    <div className="container mx-auto p-4">
      <Link 
        href="/books" 
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Books
      </Link>
      
      <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
        <h1 className="text-3xl font-bold mb-4">{state.book.title}</h1>
        <p className="text-gray-600 mb-4 whitespace-pre-wrap">{state.book.description}</p>
        <div className="mt-4">
          <a 
            href={state.book.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            Visit Book Link
          </a>
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>Created: {new Date(state.book.createdAt).toLocaleDateString()}</p>
          <p>Last updated: {new Date(state.book.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}