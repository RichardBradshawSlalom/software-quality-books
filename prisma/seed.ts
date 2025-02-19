const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Clean the database
  await prisma.review.deleteMany()
  await prisma.book.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  // Create users with profiles
  const hashedPassword = await bcrypt.hash('password123', 10)

  const alice = await prisma.user.create({
    data: {
      email: 'test@test.com',
      password: hashedPassword,
      profile: {
        create: {
          name: 'Alice Johnson',
          bio: 'Software engineer passionate about quality and testing',
          github: 'https://github.com/test',
          linkedin: 'https://linkedin.com/in/test',
          website: 'https://test.dev',
          updatedAt: new Date(),
        },
      },
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: hashedPassword,
      profile: {
        create: {
          name: 'Bob Smith',
          bio: 'Quality Assurance Engineer with 5 years of experience',
          github: 'https://github.com/bob',
          linkedin: 'https://linkedin.com/in/bob',
          updatedAt: new Date(),
        },
      },
    },
  })

  // Create books with reviews
  const cleanCode = await prisma.book.create({
    data: {
      title: 'Testing Code',
      description:
        "A Handbook of Agile Software Craftsmanship by Robert C. Martin. Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
      summary: 'A guide to writing high-quality, maintainable code that is easy to understand and modify.',
      userId: alice.id,
      reviews: {
        create: [
          {
            content: 'A must-read for every developer!',
            rating: 5,
            userId: bob.id,
          },
        ],
      },
    },
  })

  const pragmaticProgrammer = await prisma.book.create({
    data: {
      title: 'The Pragmatic Tester',
      description:
        'From Journeyman to Master by Andrew Hunt and David Thomas. Written as a series of self-contained sections and filled with classic and fresh anecdotes, thoughtful examples, and interesting analogies.',
      summary:
        'A highly regarded guide for software developers, providing practical advice and best practices to improve their craft.',
      userId: bob.id,
      reviews: {
        create: [
          {
            content: 'Excellent resource for both new and experienced developers',
            rating: 5,
            userId: alice.id,
          },
        ],
      },
    },
  })

  const refactoring = await prisma.book.create({
    data: {
      title: 'Test',
      description:
        "Improving the Design of Existing Code by Martin Fowler. For more than twenty years, experienced programmers worldwide have relied on Martin Fowler's Refactoring to improve the design of existing code and to enhance software maintainability.",
      summary:
        "It's about improving the design and quality of your code in small steps, without changing external behavior.",
      userId: alice.id,
      reviews: {
        create: [
          {
            content: 'The bible of refactoring. Essential knowledge.',
            rating: 4,
            userId: bob.id,
          },
        ],
      },
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
