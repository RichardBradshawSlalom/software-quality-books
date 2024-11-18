import { RegisterPage } from '../page-objects/register.page'
import type { TestUser } from '../data-builders/user.builder'

export class RegistrationHelper {
  constructor(private registerPage: RegisterPage) {}

  async registerNewUser(testUser: TestUser) {
    await this.registerPage.goto()
    await this.registerPage.fillEmail(testUser.email)
    await this.registerPage.fillPassword(testUser.password)
    await this.registerPage.fillName(testUser.name)
    await this.registerPage.clickCreateAccountButton()
  }
}