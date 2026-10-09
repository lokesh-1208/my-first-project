import { test } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page.js';
import { LoginPage } from '../../pages/login.page.js';

async function openLoginPage(page) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.expectVisible();
  return loginPage;
}

test.describe('Login page validation', () => {
  test('login page elements are visible', async ({ page }) => {
    await openLoginPage(page);
  });

  test('user cannot login with blank username', async ({ page }) => {
    const loginPage = await openLoginPage(page);
    await loginPage.login({ username: '', password: 'Password123' });
    await loginPage.expectError('Username is required');
  });

  test('user cannot login with blank password', async ({ page }) => {
    const loginPage = await openLoginPage(page);
    await loginPage.login({ username: process.env.SAUCE_USERNAME, password: '' });
    await loginPage.expectError('Password is required');
  });

  test('user cannot log in with invalid credentials', async ({ page }) => {
    const loginPage = await openLoginPage(page);
    await loginPage.login({ username: 'invalid_user', password: 'invalid_pass' });
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  test('user locked out after multiple failed login attempts', async ({ page }) => {
    const loginPage = await openLoginPage(page);
    await loginPage.login({ username: 'locked_out_user', password: process.env.SAUCE_PASSWORD });
    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('user logged in with valid credentials', async ({ page }) => {
    const loginPage = await openLoginPage(page);
    await loginPage.login();

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectLoaded();
    await inventoryPage.logout();
  });
});
