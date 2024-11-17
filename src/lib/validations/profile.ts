import { z } from 'zod'

export const ProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').nullable(),
  dateOfBirth: z.string().nullable(),
  image: z.string().url('Invalid image URL').nullable(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').nullable(),
  bluesky: z.string().max(100, 'Bluesky username is too long').nullable(),
  linkedin: z.string().url('Invalid LinkedIn URL').nullable(),
  github: z.string().url('Invalid GitHub URL').nullable(),
  website: z.string().url('Invalid website URL').nullable(),
})

export type ProfileFormData = z.infer<typeof ProfileSchema> 