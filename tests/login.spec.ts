import { test } from './fixtures/login-fixture'
import { expect } from '@playwright/test'

test.describe('Login Validation', () => {
  test('should show both validation messages when fields are empty', async ({ loginPage }) => {
    await loginPage.goto()
    await loginPage.clickSignIn()
    await expect(loginPage.page.getByText('Invalid email address')).toBeVisible()
    await expect(loginPage.page.getByText('Password is required')).toBeVisible()
  })

  test('should show only password validation when email is filled', async ({ loginPage }) => {
    await loginPage.goto()
    await loginPage.fillEmail('test@example.com')
    await loginPage.clickSignIn()
    await expect(loginPage.page.getByText('Password is required')).toBeVisible()
  })

  test('should show only email validation when password is filled', async ({ loginPage }) => {
    await loginPage.goto()
    await loginPage.fillPassword('password123')
    await loginPage.clickSignIn()
    await expect(loginPage.page.getByText('Invalid email address')).toBeVisible()
  })
}) 