import { test } from '../fixtures/review-fixture'
import { expect } from '@playwright/test'
import { UserBuilder } from '../data-builders/user-builder'
import { BookBuilder } from '../data-builders/book-builder'
import { Book } from '@prisma/client'

test.describe('Book Reviews', () => {
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
    testBook = await bookBuilder.create()
    console.log(testBook)
  })

  test.afterAll(async () => {
    await BookBuilder.delete(testBook.id)
    if (testBook.user?.email) {
      await UserBuilder.delete(testBook.user.email)
    }
  })

  test('should show review form when user is logged in', async ({ reviewPage, authHelper }) => {
    await authHelper.loginUser()
    await reviewPage.goto(testBook.id)
    await expect(reviewPage.reviewForm, 'Checking review form is displayed').toBeVisible()
  })

  test('should not show review form when user is not logged in', async ({ reviewPage }) => {
    await reviewPage.goto(testBook.id)
    await expect(reviewPage.reviewForm, 'Checking review form is not displayed').not.toBeVisible()
    await expect(reviewPage.page.getByText('Sign in to leave a review'), 'Checking sign in error is displayed').toBeVisible()
  })

  test('should show validation error when submitting empty review', async ({ reviewPage, authHelper }) => {
    await authHelper.loginUser()
    await reviewPage.goto(testBook.id)
    await reviewPage.submitReview('', 0)
    await expect(reviewPage.page.getByText('Review content is required'), 'Checking review content error is displayed').toBeVisible()
    await expect(reviewPage.page.getByText('Rating is required'), 'Checking review rating error message is displayed').toBeVisible()
  })

  test('should successfully submit review', async ({ reviewPage, authHelper }) => {
    const testUser = await authHelper.loginUser()
    console.log(testUser)
    await reviewPage.goto(testBook.id)
    
    const reviewContent = 'This is a test review'
    const rating = 4
    
    await reviewPage.submitReview(reviewContent, rating)
    
    // Cleanup
    await UserBuilder.delete(testUser.email)
  })

  test('should hide review form after submitting a review', async ({ reviewPage, authHelper }) => {
    const testUser = await authHelper.loginUser()
    await reviewPage.goto(testBook.id)
    
    // Submit a review
    await reviewPage.submitReview('Test review content', 4)
    
    // Verify review form is hidden
    await expect(reviewPage.reviewForm).not.toBeVisible()
    await expect(reviewPage.page.getByText('You have already reviewed this book')).toBeVisible()
    
    // Cleanup
    await UserBuilder.delete(testUser.email)
  })

  test('should show already reviewed message when revisiting page', async ({ reviewPage, authHelper }) => {
    const testUser = await authHelper.loginUser()
    await reviewPage.goto(testBook.id)
    
    // Submit initial review
    await reviewPage.submitReview('Test review content', 4)
    
    // Reload page
    await reviewPage.goto(testBook.id)
    
    // Verify review form is still hidden
    await expect(reviewPage.reviewForm).not.toBeVisible()
    await expect(reviewPage.page.getByText('You have already reviewed this book')).toBeVisible()
    
    // Cleanup
    await UserBuilder.delete(testUser.email)
  })
})