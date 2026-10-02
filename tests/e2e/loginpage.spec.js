import { test, expect } from '@playwright/test';
import { loginAsStandardUser, loginScreenlocators, logoutUser } from '../../utils/auth.js';

test('user can log in and see products', async ({ page }) => {
  await loginScreenlocators(page);
  await loginAsStandardUser(page);

  await expect(page).toHaveURL(/.*inventory\.html/);
  await expect(page.locator('.title')).toHaveText('Products');

  await logoutUser(page);
});


