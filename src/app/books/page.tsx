// app/books/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Book } from '@/types/book' // We'll create this type

interface BookState {
  books: Book[]
  isLoading: boolean
  error: string | null
}

export default function BooksPage() {
  const [state, setState] = useState<BookState>({
    books: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books')
        if (!res.ok) throw new Error('Failed to fetch books')
        const data = await res.json()
        setState(prev => ({ ...prev, books: data, isLoading: false }))
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An error occurred',
          isLoading: false
        }))
      }
    }

    fetchBooks()
  }, [])

  if (state.isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="bg-red-50 border border-red-200 rounded p-4">
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Books</h1>
      <Link 
        href="/books/new" 
        className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add New Book
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {state.books.map((book) => (
          <div key={book.id} className="border rounded p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/books/${book.id}`} className="hover:text-blue-500">
                {book.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-2 line-clamp-2">{book.description}</p>
            <a 
              href={book.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Visit Book Link
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}