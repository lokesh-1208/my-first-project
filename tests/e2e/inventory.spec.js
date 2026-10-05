import { test, expect } from '@playwright/test';
import * as Auth from '../../utils/auth.js';
import { products, productIds } from '../../test-data/products.js';
import { pickRandomItems } from '../../utils/product-selection.js';

test.describe("Navigate to Inventory + Cart behavior", () => {
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

  test('inventory displays the expected price for each product', async ({ page }) => {
    await Auth.login(page);
    await Auth.expectInventoryProductPrices(page, products);

    for (const product of products) {
      console.log(`Verified inventory price: ${product.id} = ${product.price}`);
    }
  });

  test('add and remove three products from cart', async ({ page }) => {
    await Auth.login(page);
    const selectedProductIds = pickRandomItems(productIds, 3);
    console.log(`Selected products: ${selectedProductIds.join(', ')}`);

    for (const productId of selectedProductIds) {
      await Auth.addItemToCart(page, productId);
      console.log(`Added product: ${productId}`);
    }
    await Auth.expectCartCount(page, selectedProductIds.length);

    for (const [index, productId] of selectedProductIds.entries()) {
      await Auth.removeItemFromCart(page, productId);
      console.log(`Removed product: ${productId}`);
      await Auth.expectCartCount(page, selectedProductIds.length - index - 1);
    }
  });

  test('add and remove all six products from cart', async ({ page }) => {
    await Auth.login(page);

    for (const productId of productIds) {
      await Auth.addItemToCart(page, productId);
      console.log(`Added product: ${productId}`);
    }
    await Auth.expectCartCount(page, productIds.length);

    for (const [index, productId] of productIds.entries()) {
      await Auth.removeItemFromCart(page, productId);
      console.log(`Removed product: ${productId}`);
      await Auth.expectCartCount(page, productIds.length - index - 1);
    }
  });

  test('add two products and remove one from cart', async ({ page }) => {
    await Auth.login(page);
    const selectedProductIds = pickRandomItems(productIds, 2);
    console.log(`Selected products: ${selectedProductIds.join(', ')}`);

    for (const productId of selectedProductIds) {
      await Auth.addItemToCart(page, productId);
      console.log(`Added product: ${productId}`);
    }
    await Auth.expectCartCount(page, selectedProductIds.length);

    const productToRemove = selectedProductIds[0];
    await Auth.removeItemFromCart(page, productToRemove);
    console.log(`Removed product: ${productToRemove}`);
    await Auth.expectCartCount(page, selectedProductIds.length - 1);

    const remainingProduct = selectedProductIds[1];
    await Auth.removeItemFromCart(page, remainingProduct);
    console.log(`Removed product for cleanup: ${remainingProduct}`);
    await Auth.expectCartCount(page, 0);
  });
});

