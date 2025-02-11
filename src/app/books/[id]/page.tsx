// app/books/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Book } from '@/types/book'
import { useSession } from 'next-auth/react'
import ReviewForm from '@/components/ReviewForm'
import DeleteBookButton from '@/components/DeleteBookButton'
import Loading from '@/components/Loading'
import ErrorComponent from '@/components/ErrorComponent'
import BookDetails from '@/components/BookDetails'
import ReviewItem from '@/components/ReviewItem'

export interface Review {
  id: string
  content: string
  rating: number
  createdAt: string
  user: {
    id: string
    profile: {
      name: string | null
    }
    email: string | null
  }
}

interface BookState {
  book: Book | null
  reviews: Review[]
  isLoading: boolean
  error: string | null
}

export default function BookPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  console.log('[LOG] - Session:', session)
  const [state, setState] = useState<BookState>({
    book: null,
    reviews: [],
    isLoading: true,
    error: null,
  })

  const fetchData = async () => {
    console.log('[LOG] - Fetching data for book ID:', params.id)
    try {
      const [bookRes, reviewsRes] = await Promise.all([
        fetch(`/api/books/${params.id}`),
        fetch(`/api/books/${params.id}/reviews`),
      ])

      if (!bookRes.ok) {
        console.error(`[ERROR] - Failed to fetch book with ID: ${params.id}`)
        throw new Error('Failed to fetch book')
      }

      if (!reviewsRes.ok) {
        console.error(`[ERROR] - Failed to fetch reviews for book with ID: ${params.id}`)
        throw new Error('Failed to fetch reviews')
      }

      const book = await bookRes.json()
      const reviews = await reviewsRes.json()
      console.log('[LOG] - Book fetched:', book)
      console.log('[LOG] - Reviews fetched:', reviews)

      setState({
        book,
        reviews,
        isLoading: false,
        error: null,
      })
    } catch (error: unknown) {
      console.error('[ERROR] - Error fetching data:', error)

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }))
    }
  }
  const hasUserReviewed = state.reviews.some((review) => {
    const userReviewed = review.user?.id === session?.user?.id
    console.log('[LOG] - Review:', review, 'User reviewed:', userReviewed)
    return userReviewed
  })

  useEffect(() => {
    fetchData()
  }, [params.id])

  if (state.isLoading) {
    console.log('[LOG] - State is loading')
    return <Loading />
  }

  if (state.error) {
    console.log('[ERROR] - State error: ', state.error)
    return <ErrorComponent message={state.error} />
  }

  if (!state.book) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Book not found</h1>
      </div>
    )
  }

  const isOwner = session?.user?.id === state.book.userId

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/books" className="text-blue-500 hover:underline">
            ← Back to Books
          </Link>
          {isOwner && (
            <div className="space-x-2">
              <Link
                href={`/books/${params.id}/edit`}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Edit
              </Link>
              <DeleteBookButton bookId={params.id} />
            </div>
          )}
        </div>

        <BookDetails book={state.book} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>

          {session ? (
            hasUserReviewed ? (
              <p className="text-gray-600 italic mb-8">You have already reviewed this book</p>
            ) : (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
                <ReviewForm bookId={params.id} onReviewAdded={fetchData} />
              </div>
            )
          ) : (
            <p className="mb-8">
              <Link href="/login" className="text-blue-500 hover:underline">
                Sign in
              </Link>{' '}
              to leave a review
            </p>
          )}

          <div className="space-y-6">
            {state.reviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}

            {state.reviews.length === 0 && (
              <p className="text-gray-500 text-center">No reviews yet. Be the first to review this book!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
