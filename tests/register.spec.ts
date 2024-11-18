import { UserBuilder } from './data-builders/user.builder'
import { test, expect } from './fixtures/registration.fixture'

test.describe('Registration', () => {
  test('should show success notification when registering a new account', async ({ 
    registrationHelper, 
    registerPage,
    userBuilder 
  }) => {
    const testUser = await userBuilder.build()
    await registrationHelper.registerNewUser(testUser)

    await expect(registerPage.page.getByText('Account created successfully!')).toBeVisible()
    await expect(registerPage.page).toHaveURL('/login')

    await test.step('cleanup', async () => {
      await UserBuilder.delete(testUser.email)
    })
  })
})