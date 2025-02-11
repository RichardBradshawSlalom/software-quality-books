// app/api/books/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { BookSchema } from '@/lib/validations/book'
import { ZodError } from 'zod'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  console.log('[LOG] - GET request received for book ID:', params.id)
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    })
    console.log('[LOG] - Book fetched:', book)

    if (!book) {
      console.error('[ERROR] - Book not found')
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('[ERROR] - Failed to fetch book')
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  console.log('[LOG] - PUT request received for book ID:', params.id)
  const session = await getServerSession(authOptions)
  console.log('[LOG] - Session:', session)

  if (!session) {
    console.error('[ERROR] - Unauthorized')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    })

    if (!book) {
      console.error('[ERROR] - Book not found')
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.userId !== session.user.id) {
      console.error('[ERROR] - Not authorized to edit this book')
      return NextResponse.json({ error: 'Not authorized to edit this book' }, { status: 403 })
    }

    const body = await request.json()

    // Validate the input
    const validatedData = BookSchema.parse(body)

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        summary: validatedData.summary,
      },
    })
    console.log('[LOG] - Book updated:', updatedBook)

    return NextResponse.json(updatedBook)
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('[ERROR] - Validation error:', error)
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('[ERROR] - Failed to update book - ', error)
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  console.log('[LOG] - DELETE request received for book ID:', params.id)
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    })
    console.log('[LOG] - Book fetched for deletion:', book)

    if (!book) {
      console.error('[ERROR] - Book not found')
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.userId !== session.user.id) {
      console.error('[ERROR] - Not authorized to delete this book')
      return NextResponse.json({ error: 'Not authorized to delete this book' }, { status: 403 })
    }

    await prisma.book.delete({
      where: { id: params.id },
    })

    console.log('[LOG]: Book deleted')
    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('[ERROR] - Failed to delete book:', error)
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
  }
}
