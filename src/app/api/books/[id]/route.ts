// app/api/books/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'

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
    
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description
      }
    })

    return NextResponse.json(updatedBook)
  } catch (error) {
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