import { UserBuilder } from './data-builders/user.builder'
import { test, expect } from './fixtures/test.fixture'

test.use({ headless: false });

test.describe('Registration', () => {
  test('should show success notification when registering a new account', async ({ 
    registerPage, 
    userBuilder 
  }) => {
    // Arrange
    const testUser = await userBuilder.build();

    // Act
    await registerPage.goto()
    await registerPage.register(testUser.email, testUser.password, testUser.name)

    // Assert
    await registerPage.expectSuccessNotification()
    await expect(registerPage.page).toHaveURL('/login')

    // Clean up
    await test.step('cleanup', async () => {
      await UserBuilder.delete(testUser.email)
    })
  })
})