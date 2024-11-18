import { encode } from 'next-auth/jwt'
import { UserBuilder } from '../data-builders/user-builder'
import { Page } from '@playwright/test'

export class AuthHelper {
  constructor(private page: Page) {}

  async loginUser(user?: { id: string; email: string }) {
    // Create test user if not provided
    const testUser = user || await new UserBuilder().create()
    
    // Generate session token
    const token = await encode({
      token: {
        email: testUser.email,
        id: testUser.id,
        sub: testUser.id,
      },
      secret: process.env.NEXTAUTH_SECRET || 'test-secret',
    })

    // Set the session cookie
    await this.page.context().addCookies([{
      name: 'next-auth.session-token',
      value: token,
      domain: 'localhost',
      path: '/',
    }])

    return testUser
  }
} 