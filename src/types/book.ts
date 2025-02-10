// src/types/book.ts
import type { Review } from './review'
import type { User } from './user'

export interface Book {
  id: string
  title: string
  description: string
  summary: string
  createdAt: string
  updatedAt: string
  userId?: string
  user?: User
  reviews?: Review[]
}
