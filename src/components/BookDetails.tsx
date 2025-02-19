import React from 'react'
import { Book } from '@/types/book'

interface BookDetailsProps {
  book: Book
}

export default function BookDetails({ book }: BookDetailsProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <h1 className="text-3xl font-bold mb-4" data-testid="book-details-title">
        {book.title}
      </h1>
      <p className="text-gray-600 whitespace-pre-wrap" data-testid="book-details-description">
        {book.description}
      </p>
    </div>
  )
}
