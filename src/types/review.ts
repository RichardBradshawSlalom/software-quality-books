export interface Review {
  id: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
  bookId: string
  userId: string
  user?: {
    name: string | null
    email: string
  }
} 