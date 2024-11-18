import { test as base } from '@playwright/test'
import { RegisterPage } from '../page-objects/register.page'
import { UserBuilder } from '../data-builders/user.builder'

type Pages = {
  registerPage: RegisterPage
}

export type TestFixtures = {
  userBuilder: UserBuilder;
};

// Extend basic test fixture with our pages
export const test = base.extend<Pages & TestFixtures>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page))
  },
  userBuilder: async ({}, use) => {
    await use(new UserBuilder())
  }
})

export { expect } from '@playwright/test' 