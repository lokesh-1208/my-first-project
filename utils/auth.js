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

export async function inventoryScreenlocators(page) {
  await expect(page.getByText('Swag Labs'), {exact: true}).toBeVisible();
  await expect(page.getByText('Products'), {exact: true}).toBeVisible();
  await expect(page.locator('[data-test="item-1-title-link"]')).toHaveText('Sauce Labs Bolt T-Shirt');
  await expect(page.locator('[data-test="item-2-title-link"]')).toHaveText('Sauce Labs Onesie');
  await expect(page.locator('[data-test="item-3-title-link"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
  await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('[data-test="item-5-title-link"]')).toHaveText('Sauce Labs Fleece Jacket');
  await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
  await expect(page.getByText('A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.')).toBeVisible();
  await expect(page.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.')).toBeVisible();
  await expect(page.getByText('Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won\'t unravel.')).toBeVisible();
  await expect(page.getByText('This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.')).toBeVisible();
  await expect(page.getByText('It\'s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.')).toBeVisible();
  await expect(page.getByText('Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.')).toBeVisible();

  const sortOptions = page.locator('[data-test="product-sort-container"] option');

  await expect(sortOptions).toHaveText([
  'Name (A to Z)',
  'Name (Z to A)',
  'Price (low to high)',
  'Price (high to low)',
]);
}

export async function leftMenuLocators(page) {
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await expect(page.locator('[data-test="inventory-sidebar-link"]')).toContainText('All Items');
  await expect(page.locator('[data-test="dynamic-catalog-sidebar-link"]')).toContainText('Dynamic Catalog');
  await page.locator('[data-test="dynamic-catalog-sidebar-link"]').click();
  await expect(page.locator('[data-test="dynamic-catalog-lazy-load-link"]')).toContainText('Lazy Load');
  await expect(page.locator('[data-test="dynamic-catalog-spinner-link"]')).toContainText('Spinner');
  await expect(page.locator('[data-test="dynamic-catalog-slider-link"]')).toContainText('Slider');
  await expect(page.locator('[data-test="about-sidebar-link"]')).toContainText('About');
  await expect(page.locator('[data-test="logout-sidebar-link"]')).toContainText('Logout');
  await expect(page.locator('[data-test="reset-sidebar-link"]')).toContainText('Reset App State');
  await page.getByRole('button', { name: 'Close Menu' }).click();
}  

export async function addremoveItemsFromCart(page) {
  await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toContainText('Add to cart');
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toContainText('Remove');
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
}

export async function addItemToCart(page, productId) {
  const addButton = page.locator(`[data-test="add-to-cart-${productId}"]`);
  await expect(addButton).toHaveText('Add to cart');
  await addButton.click();
}

export async function removeItemFromCart(page, productId) {
  const removeButton = page.locator(`[data-test="remove-${productId}"]`);
  await expect(removeButton).toHaveText('Remove');
  await removeButton.click();
}

export async function expectCartCount(page, count) {
  const cartBadge = page.locator('.shopping_cart_badge');
  if (count === 0) {
    await expect(cartBadge).not.toBeVisible();
    return;
  }
  await expect(cartBadge).toHaveText(String(count));
}