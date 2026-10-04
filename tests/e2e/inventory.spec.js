import { test, expect } from '@playwright/test';
import * as Auth from '../../utils/auth.js';


test.describe("Login and navigate to inventory", () => {
 test('user can log in and navigate to left menu then logout', async ({ page }) => {
    await Auth.login(page);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.title')).toHaveText('Products');
    await Auth.leftMenuLocators(page);
    await Auth.logoutUser(page);
});

  test('Inventory page elements are visible', async ({ page }) => {
    await Auth.login(page);
    await Auth.inventoryScreenlocators(page);
    await Auth.logoutUser(page);
});
});

