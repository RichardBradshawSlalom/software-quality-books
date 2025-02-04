import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      console.error('[ERROR]: No email or no password entered')
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.error('[ERROR]: User already exists')
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            name: name ?? null,
            updatedAt: new Date(),
          },
        },
      },
      select: {
        id: true,
        email: true,
        profile: true,
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[ERROR]: Registration error - ', error)
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}
