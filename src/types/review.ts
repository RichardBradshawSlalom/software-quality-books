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
