import { BooksPage } from '../page-objects/books-page'
import { test as base } from '@playwright/test'
import { BookBuilder } from '../data-builders/book-builder'

export type TestFixtures = {
  booksPage: BooksPage;
  bookBuilder: BookBuilder;
}

export const test = base.extend<TestFixtures>({
  booksPage: async ({ page }, use) => {
    await use(new BooksPage(page))
  },
  bookBuilder: async ({}, use) => {
    await use(BookBuilder.aBook())
  }
})

export { expect } from '@playwright/test' 