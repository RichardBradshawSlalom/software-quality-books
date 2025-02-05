import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

// Create a validation schema for reviews
const ReviewSchema = z.object({
  content: z
    .string()
    .min(1, 'Review content is required')
    .max(1000, 'Review content must be less than 1000 characters'),
  rating: z.coerce.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
})

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log('[LOG] - GET request received for book ID:', params.id)
  try {
    const reviews = await prisma.review.findMany({
      where: {
        bookId: params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    console.log('[LOG] - Reviews fetched:', reviews)
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('[ERROR] - Failed to fetch reviews - ', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  console.log('[LOG] - POST request received for book ID:', params.id)
  try {
    const session = await getServerSession(authOptions)
    console.log('[LOG] - Session:', session)
    if (!session?.user?.id) {
      console.error('[ERROR] - Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ReviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        content: validatedData.content,
        rating: validatedData.rating,
        bookId: params.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    console.log('[LOG] - Review created:', review)

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('[ERROR] - Failed to create review - ', error)

    if (error instanceof z.ZodError) {
      console.error('[ERROR] - Validation error - ', error.errors)
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    // Handle Prisma unique constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        console.error('[ERROR] - Already reviewed - ', error)
        return NextResponse.json({ error: 'You have already reviewed this book' }, { status: 400 })
      }
    }

    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
