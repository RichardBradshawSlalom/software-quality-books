import { test } from './fixtures/new-book-fixture'
import { expect } from '@playwright/test'
import { BookBuilder } from './data-builders/book-builder'

test.describe('New Book Page', () => {
  test.beforeEach(async ({ authHelper }) => {
    // Login before each test
    await authHelper.loginUser()
  })

  test('should create a new book successfully', async ({ newBookPage }) => {
    const testTitle = 'Test Book Title'
    const testDescription = 'Test Book Description'

    await newBookPage.goto()
    await newBookPage.createBook(testTitle, testDescription)

    // Verify success notification
    await expect(newBookPage.page.getByText('Book added successfully')).toBeVisible()

    // Verify redirect to books page
    await expect(newBookPage.page).toHaveURL('/books')

    // Clean up the created book
    // Note: You might need to fetch the book ID first
    const books = await BookBuilder.findByTitle(testTitle)
    if (books.length > 0) {
      await BookBuilder.delete(books[0].id)
    }
  })

  test('should show validation errors for empty fields', async ({ newBookPage }) => {
    await newBookPage.goto()
    await newBookPage.submitForm()

    // Verify validation messages
    await expect(newBookPage.page.getByText('Title is required')).toBeVisible()
    await expect(newBookPage.page.getByText('Description is required')).toBeVisible()
  })
}) 