import { test, expect } from '@playwright/test'
import { ApiHelper } from './api-helper'
import { UserBuilder } from '../data-builders/user-builder'

test.describe('Books API', () => {
  let api: ApiHelper

  test.beforeEach(async ({ request }) => {
    api = new ApiHelper(request)
  })

  test('should create a new book when authenticated', async () => {
    // Create and authenticate user
    const testUser = await api.createAuthenticatedUser()

    const newBook = {
      title: 'Test Book Title',
      description: 'Test book description'
    }

    // Create book
    const response = await api.createBook(newBook)
    
    const addedBook = await response.json();
    console.log('Create book response:', addedBook)

    expect(response.ok()).toBeTruthy()
    expect(addedBook.title, 'Book title does not match').toBe(newBook.title)
    expect(addedBook.description, 'Book description does not match').toBe(newBook.description)

    // Cleanup
    await UserBuilder.delete(testUser.email)
  })

  test('should return 401 when creating book without auth', async () => {
    const response = await api.createBook({
      title: 'Test Book',
      description: 'Test Description'
    })

    expect(response.status()).toBe(401)
    const error = await response.json()
    expect(error.error).toBe('Unauthorized')
  })
})