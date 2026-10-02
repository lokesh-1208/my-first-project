import { expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

export async function login(page, {
  baseUrl = process.env.BASE_URL,
  username = process.env.SAUCE_USERNAME,
  password = process.env.SAUCE_PASSWORD
} = {}) {
  await page.goto(baseUrl);

  const userInput = page.locator('[data-test="username"]');
  const passInput = page.locator('[data-test="password"]');

  await clearAndFill(userInput, username);
  await clearAndFill(passInput, password);

  await page.locator('[data-test="login-button"]').click();
}

async function clearAndFill(locator, value) {
  await locator.clear();
  await locator.fill(value);
}

export async function logoutUser(page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
}

export async function loginScreenlocators(page) {
  await page.goto(DEFAULT_BASE_URL);
  await expect(page.getByText('Swag Labs')).toBeVisible();
  await expect(page.getByText('Username')).toBeVisible();
  await expect(page.getByText('Password')).toBeVisible();
  await expect(page.getByText('Login')).toBeVisible();
}
