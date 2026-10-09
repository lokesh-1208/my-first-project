import { test, expect } from '@playwright/test';
import * as Auth from '../../utils/auth.js';
import { productIds } from '../../test-data/products.js';
import { pickRandomItems } from '../../utils/product-selection.js';

async function addProductsAndVerifyCart(page, selectedProductIds) {
  const expectedProducts = [];

  for (const productId of selectedProductIds) {
    const inventoryItem = page.locator(".inventory_item").filter({
      has: page.locator(`[data-test="add-to-cart-${productId}"]`),
    });
    expectedProducts.push({
      name: await inventoryItem.locator(".inventory_item_name").innerText(),
      description: await inventoryItem.locator(".inventory_item_desc").innerText(),
      price: await inventoryItem.locator(".inventory_item_price").innerText(),
    });
    await Auth.addItemToCart(page, productId);
  }

  await page.locator(".shopping_cart_link").click();

  await expect(page).toHaveURL(/.*cart\.html/);
  await expect(page.locator(".title")).toHaveText("Your Cart");
  const cartItems = page.locator(".cart_item");
  await expect(cartItems).toHaveCount(expectedProducts.length);

  for (const [index, product] of expectedProducts.entries()) {
    const cartItem = cartItems.nth(index);
    await expect(cartItem.locator(".inventory_item_name")).toHaveText(product.name);
    await expect(cartItem.locator(".inventory_item_desc")).toHaveText(product.description);
    await expect(cartItem.locator(".inventory_item_price")).toHaveText(product.price);
  }
}

test.describe("Cart screen behavior", () => {
  test("Add product and navigate to cart screen", async ({ page }) => {
    await Auth.login(page);
    const productId = pickRandomItems(productIds, 1)[0];
    await addProductsAndVerifyCart(page, [productId]);
  });

  test("Add product, navigate to cart screen, and validate added product details", async ({ page }) => {
    await Auth.login(page);
    const productId = pickRandomItems(productIds, 1)[0];
    await addProductsAndVerifyCart(page, [productId]);
  });

  test("Add product, navigate to cart screen, and remove product", async ({ page }) => {
    await Auth.login(page);
    const productId = pickRandomItems(productIds, 1)[0];
    await addProductsAndVerifyCart(page, [productId]);

    await Auth.removeItemFromCart(page, productId);
    await Auth.expectCartCount(page, 0);
    await expect(page.locator(".cart_item")).toHaveCount(0);
  });

  test("Add multiple products, navigate to cart screen and validate Checkout button", async ({ page }) => {
    await Auth.login(page);
    const selectedProductIds = pickRandomItems(productIds, 2);
    await addProductsAndVerifyCart(page, selectedProductIds);

    await expect(page.locator('[data-test="checkout"]')).toBeVisible();
    await expect(page.locator('[data-test="checkout"]')).toBeEnabled();
  });

  test("Add product, navigate to cart screen and navigate back to inventory using Continue shopping button", async ({ page }) => {
    await Auth.login(page);
    const productId = pickRandomItems(productIds, 1)[0];
    await addProductsAndVerifyCart(page, [productId]);
    await page.locator('[data-test="continue-shopping"]').click();

    await expect(page).toHaveURL(/.*inventory\.html/);
    await Auth.expectCartCount(page, 1);
  });

});