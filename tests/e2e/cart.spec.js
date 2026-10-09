import { test } from '@playwright/test';
import { CartPage } from '../../pages/cart.page.js';
import { InventoryPage } from '../../pages/inventory.page.js';
import { LoginPage } from '../../pages/login.page.js';
import { productIds } from '../../test-data/products.js';
import { pickRandomItems } from '../../test-data/product-selection.js';

async function openCartWithProducts(page, selectedProductIds) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login();

  const inventoryPage = new InventoryPage(page);
  const expectedProducts = await inventoryPage.addProducts(selectedProductIds);
  await inventoryPage.openCart();

  const cartPage = new CartPage(page);
  await cartPage.expectProducts(expectedProducts);
  return { cartPage, inventoryPage };
}

test.describe('Cart screen behavior', () => {
  test('Add product and navigate to cart screen', async ({ page }) => {
    const selectedProductIds = pickRandomItems(productIds, 1);
    await openCartWithProducts(page, selectedProductIds);
  });

  test('Add product, navigate to cart screen, and validate added product details', async ({ page }) => {
    const selectedProductIds = pickRandomItems(productIds, 1);
    await openCartWithProducts(page, selectedProductIds);
  });

  test('Add product, navigate to cart screen, and remove product', async ({ page }) => {
    const selectedProductIds = pickRandomItems(productIds, 1);
    const { cartPage, inventoryPage } = await openCartWithProducts(page, selectedProductIds);

    await cartPage.removeItem(selectedProductIds[0]);
    await cartPage.expectItemCount(0);
    await inventoryPage.expectCartCount(0);
  });

  test('Add multiple products, navigate to cart screen and validate Checkout button', async ({ page }) => {
    const selectedProductIds = pickRandomItems(productIds, 2);
    const { cartPage } = await openCartWithProducts(page, selectedProductIds);

    await cartPage.expectCheckoutReady();
  });

  test('Add product, navigate to cart screen and navigate back to inventory using Continue shopping button', async ({ page }) => {
    const selectedProductIds = pickRandomItems(productIds, 1);
    const { cartPage, inventoryPage } = await openCartWithProducts(page, selectedProductIds);

    await cartPage.continueShopping();
    await inventoryPage.expectCartCount(1);
  });
});