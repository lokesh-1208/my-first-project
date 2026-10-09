import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

const DEFAULT_BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open(baseUrl = DEFAULT_BASE_URL) {
    await this.page.goto(baseUrl);
  }

  async expectVisible() {
    await expect(this.page.getByText('Swag Labs')).toBeVisible();
    await expect(this.page.getByText('Username')).toBeVisible();
    await expect(this.page.getByText('Password')).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async login({
    username = process.env.SAUCE_USERNAME,
    password = process.env.SAUCE_PASSWORD,
  } = {}) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(message) {
    await expect(this.errorMessage).toContainText(message);
  }
}