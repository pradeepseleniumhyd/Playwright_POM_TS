import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorButton: Locator;
  readonly errorMessage: Locator;
  readonly loginCredentials: Locator;
  readonly loginPassword: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorButton = page.locator('[data-test="error-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.loginCredentials = page.locator('[data-test="login-credentials"]');
    this.loginPassword = page.locator('[data-test="login-password"]');
    this.title = page.locator('#root');
  }

  async goto(): Promise<void> {
    await this.navigateTo('https://www.saucedemo.com/');
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
  }

  async clickErrorButton(): Promise<void> {
    await this.click(this.errorButton);
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.loginButton);
  }

  async getPageTitle(): Promise<string> {
    return await this.getText(this.title);
  }
}
