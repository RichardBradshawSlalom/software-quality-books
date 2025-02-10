import { test } from '../fixtures/bookpage-fixture'
import { expect } from '@playwright/test'
import { UserBuilder } from '../data-builders/user-builder'
import { BookBuilder } from '../data-builders/book-builder'
import { Book } from '@prisma/client'

test.describe('Book page data', () => {
  
  test.describe.configure({ mode: 'serial' })
  
  let testBook: Book & { 
    user: { 
      id: string
      email: string
      password: string
      createdAt: Date
      updatedAt: Date
    } | null 
  }

  test.beforeAll(async ({ bookBuilder }) => {
    testBook = await bookBuilder
      .create()

    console.log(testBook)
  })

  test.afterAll(async () => {
    await BookBuilder.delete(testBook.id)
    if (testBook.user?.email) {
      await UserBuilder.delete(testBook.user.email)
    }
  })

  test('should display book with correct title', async ({ bookPage }) => {
    await bookPage.goto(testBook.id)
    const bookTitle = await bookPage.getBookTitle()
    expect(bookTitle, 'Expected book title to match').toBe(testBook.title)
  })

  test('should display book with correct description', async ({ bookPage }) => {
    await bookPage.goto(testBook.id)
    const bookDescription = await bookPage.getBookDescription()
    expect(bookDescription, 'Expect book description to match').toBe(testBook.description)
  })
})