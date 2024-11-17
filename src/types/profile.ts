export interface Profile {
  id: string
  name: string | null
  dateOfBirth: string | null  // Will be Date in form, string in JSON
  image: string | null
  bio: string | null
  bluesky: string | null
  linkedin: string | null
  github: string | null
  website: string | null
  userId: string
  createdAt: string
  updatedAt: string
} 