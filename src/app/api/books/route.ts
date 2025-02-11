// app/api/books/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { BookSchema } from '@/lib/validations/book'
import { ZodError } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET() {
  console.log('[LOG] - GET request received for books')
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    console.log('[LOG] - Books fetched:', books)
    return NextResponse.json(books)
  } catch (error) {
    console.error('[ERROR] - Failed to fetch books - ', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log('[LOG] - POST request received for creating a book')
  const session = await getServerSession(authOptions)
  console.log('[LOG] - Session:', session)

  if (!session) {
    console.error('[ERROR] - Unauthorized')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validate the input
    const validatedData = BookSchema.parse(body)
    console.log('[LOG] - Validated data:', validatedData)

    // Check if userId exists in the User table
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })
    if (!user) {
      console.error('[ERROR] - User not found for userId:', session.user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const book = await prisma.book.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        summary: validatedData.summary,
        userId: session.user.id,
      },
    })
    console.log('[LOG] - Book created:', book)

    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('[ERROR] - Validation error:', error.errors)
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('[ERROR] - Failed to create book - ', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}
