import { test, expect } from '@playwright/test';
import * as Auth from '../../utils/auth.js';

const products = [
  { id: 'sauce-labs-backpack', price: '$29.99' },
  { id: 'sauce-labs-bike-light', price: '$9.99' },
  { id: 'sauce-labs-bolt-t-shirt', price: '$15.99' },
  { id: 'sauce-labs-fleece-jacket', price: '$49.99' },
  { id: 'sauce-labs-onesie', price: '$7.99' },
  { id: 'test.allthethings()-t-shirt-(red)', price: '$15.99' },
];
const productIds = products.map((product) => product.id);

function pickRandomProducts(products, count) {
  const shuffledProducts = [...products];

  for (let index = shuffledProducts.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledProducts[index], shuffledProducts[randomIndex]] = [
      shuffledProducts[randomIndex],
      shuffledProducts[index],
    ];
  }

  return shuffledProducts.slice(0, count);
}


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
    const selectedProductIds = pickRandomProducts(productIds, 3);
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
    const selectedProductIds = pickRandomProducts(productIds, 2);
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

