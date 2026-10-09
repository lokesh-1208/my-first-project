import { test } from '@playwright/test';
import { InventoryPage } from '../../pages/inventory.page.js';
import { LoginPage } from '../../pages/login.page.js';
import { products, productIds } from '../../test-data/products.js';
import { pickRandomItems } from '../../test-data/product-selection.js';

async function openInventory(page) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login();
  return new InventoryPage(page);
}

test.describe('Inventory and cart behavior', () => {
  test('user can log in, navigate the left menu, and log out', async ({ page }) => {
    const inventoryPage = await openInventory(page);
    await inventoryPage.expectLoaded();
    await inventoryPage.expectMenuOptions();
    await inventoryPage.logout();
  });

  test('Inventory page elements are visible', async ({ page }) => {
    const inventoryPage = await openInventory(page);
    await inventoryPage.expectProductCatalog();
    await inventoryPage.logout();
  });

  test('inventory displays the expected price for each product', async ({ page }) => {
    const inventoryPage = await openInventory(page);
    await inventoryPage.expectProductPrices(products);
  });

  test('add and remove three products from cart', async ({ page }) => {
    const inventoryPage = await openInventory(page);
    const selectedProductIds = pickRandomItems(productIds, 3);

    for (const productId of selectedProductIds) {
      await inventoryPage.addItemToCart(productId);
    }
    await inventoryPage.expectCartCount(selectedProductIds.length);

    for (const [index, productId] of selectedProductIds.entries()) {
      await inventoryPage.removeItemFromCart(productId);
      await inventoryPage.expectCartCount(selectedProductIds.length - index - 1);
    }
  });

  test('add and remove all six products from cart', async ({ page }) => {
    const inventoryPage = await openInventory(page);

    for (const productId of productIds) {
      await inventoryPage.addItemToCart(productId);
    }
    await inventoryPage.expectCartCount(productIds.length);

    for (const [index, productId] of productIds.entries()) {
      await inventoryPage.removeItemFromCart(productId);
      await inventoryPage.expectCartCount(productIds.length - index - 1);
    }
  });

  test('add two products and remove one from cart', async ({ page }) => {
    const inventoryPage = await openInventory(page);
    const selectedProductIds = pickRandomItems(productIds, 2);

    for (const productId of selectedProductIds) {
      await inventoryPage.addItemToCart(productId);
    }
    await inventoryPage.expectCartCount(selectedProductIds.length);

    await inventoryPage.removeItemFromCart(selectedProductIds[0]);
    await inventoryPage.expectCartCount(selectedProductIds.length - 1);

    await inventoryPage.removeItemFromCart(selectedProductIds[1]);
    await inventoryPage.expectCartCount(0);
  });
});

