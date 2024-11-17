// app/api/books/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { BookSchema } from '@/lib/validations/book'
import { ZodError } from 'zod'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch book' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to edit this book' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate the input
    const validatedData = BookSchema.parse(body)

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        description: validatedData.description
      }
    })

    return NextResponse.json(updatedBook)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update book' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    if (book.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this book' },
        { status: 403 }
      )
    }

    await prisma.book.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Book deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete book' },
      { status: 500 }
    )
  }
}