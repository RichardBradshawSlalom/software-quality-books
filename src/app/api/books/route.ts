// app/api/books/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 3
    })
    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const book = await prisma.book.create({
      data: {
        title: body.title,
        description: body.description,
        userId: session.user.id
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