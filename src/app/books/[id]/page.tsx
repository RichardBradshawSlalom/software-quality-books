// app/books/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Book } from '@/types/book'
import { useSession } from 'next-auth/react'

interface BookState {
  book: Book | null
  isLoading: boolean
  error: string | null
}

export default function BookPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [state, setState] = useState<BookState>({
    book: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    fetch(`/api/books/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch book')
        return res.json()
      })
      .then(book => setState({ book, isLoading: false, error: null }))
      .catch(error => setState({ book: null, isLoading: false, error: error.message }))
  }, [params.id])

  if (state.isLoading) {
    return <div>Loading...</div>
  }

  if (state.error) {
    return <div>Error: {state.error}</div>
  }

  if (!state.book) {
    return <div>Book not found</div>
  }

  const isOwner = session?.user?.id === state.book.userId

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Link 
            href="/books"
            className="text-blue-500 hover:underline"
          >
            ← Back to Books
          </Link>
          {isOwner && (
            <Link
              href={`/books/${params.id}/edit`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Book
            </Link>
          )}
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{state.book.title}</h1>
          <p className="text-gray-600 whitespace-pre-wrap">{state.book.description}</p>
        </div>
      </div>
    </div>
  )
}