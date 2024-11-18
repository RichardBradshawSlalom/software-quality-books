import { Page, Locator, expect } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly signInButton: Locator

  constructor(page: Page) {
    this.page = page
    this.signInButton = page.getByText('Sign In')
  }

  async goto() {
    await this.page.goto('/')
  }

  async clickSignIn() {
    await this.signInButton.waitFor({ state: 'visible' })
    await this.signInButton.click()
  }
} 