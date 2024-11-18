import { LoginPage } from '../page-objects/login-page'
import { test as base } from '@playwright/test'

export type TestFixtures = {
  loginPage: LoginPage
}

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  }
})