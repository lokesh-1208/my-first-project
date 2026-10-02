import { test, expect } from '@playwright/test';
import * as Auth from '../../utils/auth.js';

test.describe("Login and tab Navigation", () => {
 test('user can log in and see products then logout', async ({ page }) => {
    await Auth.login(page);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
    await Auth.logoutUser(page);
});
});

test.describe('Login page validation', () => {
  test('login page elements are visible', async ({ page }) => {
    await Auth.loginScreenlocators(page);
  });

  test('user cannot login with blank username', async ({ page }) => {
    await Auth.loginScreenlocators(page);
    await Auth.login(page, { username: '', password: 'Password123' });
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('user cannot login with blank password', async ({ page }) => {
    await Auth.loginScreenlocators(page);
    await Auth.login(page, { username: 'standard_user', password: '' });
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('user cannot log in with invalid credentials', async ({ page }) => {
    await Auth.loginScreenlocators(page);
    await Auth.login(page, { username: 'invalid_user', password: 'invalid_pass' });   
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match any user in this service');

  });

    test('user logged in with valid credentials', async ({ page }) => {
    await Auth.loginScreenlocators(page);
    await Auth.login(page);
    await Auth.logoutUser(page);
});
});
