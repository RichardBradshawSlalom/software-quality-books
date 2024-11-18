import { Page, Locator, expect } from '@playwright/test'

export class RegisterPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly nameInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Password')
    this.nameInput = page.getByLabel('Name')
    this.submitButton = page.getByText('Create account')
  }

  async goto() {
    await this.page.goto('/register')
  }

  async register(email: string, password: string, name: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.nameInput.fill(name)
    await this.submitButton.click()
  }

  async expectSuccessNotification() {
    await expect(this.page.getByText('Account created successfully!')).toBeVisible()
  }
} 