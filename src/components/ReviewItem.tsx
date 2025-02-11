import React from 'react'
import { Review } from '@/types/review'

interface ReviewItemProps {
  review: Review
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{review.user.profile?.name || 'Anonymous'}</div>
        <div className="text-yellow-500">
          {'★'.repeat(review.rating)}
          {'☆'.repeat(5 - review.rating)}
        </div>
      </div>
      <p className="text-gray-600">{review.content}</p>
      <div className="text-sm text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</div>
    </div>
  )
}
