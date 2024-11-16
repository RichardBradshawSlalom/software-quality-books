// app/api/books/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const book = await prisma.book.create({
      data: {
        title: body.title,
        description: body.description
      },
    })
    return NextResponse.json(book, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    )
  }
}