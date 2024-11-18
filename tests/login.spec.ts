import { test } from './fixtures/homepage-fixture'
import { expect } from '@playwright/test'

test.describe('Login Navigation', () => {
  test('should navigate to login page when clicking Sign In button', async ({ homePage }) => {
    // Navigate to homepage
    await homePage.goto()
    
    // Click sign in using PO method
    await homePage.clickSignIn()
    
    // Verify URL changed to login page
    await expect(homePage.page).toHaveURL('/login')
    
    // Verify login form elements are present
    await expect(homePage.page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible()
    await expect(homePage.page.getByLabel('Email')).toBeVisible()
    await expect(homePage.page.getByLabel('Password')).toBeVisible()
    await expect(homePage.page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })
}) 