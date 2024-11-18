import { Page, expect } from '@playwright/test'

export class HomePage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async clickSignIn() {
    await this.page.getByRole('link', { name: 'Sign In' }).click()
  }
} 