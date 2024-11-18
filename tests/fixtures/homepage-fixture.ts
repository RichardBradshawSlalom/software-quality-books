import { HomePage } from '../page-objects/home-page'
import { test as base } from '@playwright/test'

export type TestFixtures = {
  homePage: HomePage
}

export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  }
}) 