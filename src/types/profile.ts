export interface Profile {
  id: string
  name: string | null
  dateOfBirth: Date | string | null  // Accept both Date and string
  image: string | null
  bio: string | null
  bluesky: string | null
  linkedin: string | null
  github: string | null
  website: string | null
  userId: string
  createdAt: Date | string | null  // Accept both Date and string
  updatedAt: Date | string | null  // Accept both Date and string
} 