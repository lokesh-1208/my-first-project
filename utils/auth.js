import { expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

export async function loginAsStandardUser(page) {
  await page.goto(BASE_URL);

  await page.locator('[data-test="username"]').fill(process.env.SAUCE_USERNAME || 'standard_user');
  await page.locator('[data-test="password"]').fill(process.env.SAUCE_PASSWORD || 'secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await page.waitForURL(/.*inventory\.html/);
}

export async function logoutUser(page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
}

export async function loginScreenlocators(page) {
  await page.goto(BASE_URL);
  await expect(page.getByText('Swag Labs')).toBeVisible();
  await expect(page.getByText('Username')).toBeVisible();
  await expect(page.getByText('Password')).toBeVisible();
  await expect(page.getByText('Login')).toBeVisible();
}
