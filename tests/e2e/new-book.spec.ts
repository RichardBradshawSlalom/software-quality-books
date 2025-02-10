import { test } from '../fixtures/new-book-fixture'
import { expect } from '@playwright/test'
import { UserBuilder } from '../data-builders/user-builder'
import { BookBuilder } from '../data-builders/book-builder'

test.describe('New Book Validation', () => {
  let testUser: Awaited<ReturnType<UserBuilder['create']>>

  test.beforeEach(async ({ authHelper }) => {
    // Create and login a test user
    testUser = await new UserBuilder().create()
    await authHelper.loginUser(testUser)
    console.log(testUser)
  })

  test.afterEach(async () => {
    // Only attempt cleanup if we have a test user
    if (testUser?.email) {
      await UserBuilder.delete(testUser.email)
    }
  })

  test('should show error when title is empty', async ({ newBookPage }) => {
    await newBookPage.goto()
    await newBookPage.createBook('', 'Valid description')
    await expect(newBookPage.page.getByText('Title is required'), 'Checking title error message is displayed').toBeVisible()
  })

  test('should show error when title exceeds 100 characters', async ({ newBookPage }) => {
    await newBookPage.goto()
    const longTitle = 'a'.repeat(101)
    await newBookPage.createBook(longTitle, 'Valid description')
    await expect(newBookPage.page.getByText('Title must be less than 100 characters'), 'Checking title error message is displayed').toBeVisible()
  })

  test('should show error when description is empty', async ({ newBookPage }) => {
    await newBookPage.goto()
    await newBookPage.createBook('Valid title', '')
    await expect(newBookPage.page.getByText('Description is required'), 'Checking description error is displayed').toBeVisible()
  })

  test('should show error when description exceeds 750 characters', async ({ newBookPage }) => {
    await newBookPage.goto()
    const longDescription = 'a'.repeat(751)
    await newBookPage.createBook('Valid title', longDescription)
    await expect(newBookPage.page.getByText('Description must be less than 500 characters'), 'Checking description error is displayed').toBeVisible()
  })

  test('should show both errors when title and description are empty', async ({ newBookPage }) => {
    await newBookPage.goto()
    await newBookPage.createBook('', '')
    await expect(newBookPage.page.getByText('Title is required'), 'Checking title error is displayed').toBeVisible()
    await expect(newBookPage.page.getByText('Description is required'), 'Checking description error is displayed').toBeVisible()
  })

  test('should not make API call when validation fails', async ({ newBookPage, page }) => {
    // Set up API route listener
    let apiCallMade = false
    await page.route('**/api/books', async route => {
      apiCallMade = true
      await route.fulfill({ status: 200 })
    })

    await newBookPage.goto()
    await newBookPage.createBook('', '') // Invalid input

    // Verify validation errors are shown
    await expect(newBookPage.page.getByText('Title is required'), 'Checking title error is displayed').toBeVisible()
    await expect(newBookPage.page.getByText('Description is required'), 'Checking description error is displayed').toBeVisible()
    
    // Verify no API call was made
    expect(apiCallMade).toBe(false)
  })

  test('should successfully create book with valid data', async ({ newBookPage }) => {
    await newBookPage.goto()
    const bookTitle = 'Valid Title'
    const bookDescription = 'Valid description that meets the minimum requirements'
    await newBookPage.createBook(bookTitle, bookDescription)
    
    // Should redirect to books page after successful creation
    await expect(newBookPage.page, 'Checking we have moved to the books page').toHaveURL('/books')

    BookBuilder.deleteByTitle(bookTitle)
  })
}) 