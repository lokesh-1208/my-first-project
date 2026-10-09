import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async expectLoaded() {
    await this.expectUrl('cart');
    await this.expectTitle('Your Cart');
  }

  async expectProducts(expectedProducts) {
    await this.expectLoaded();
    await expect(this.cartItems).toHaveCount(expectedProducts.length);

    for (const [index, product] of expectedProducts.entries()) {
      const cartItem = this.cartItems.nth(index);
      await expect(cartItem.locator('.inventory_item_name')).toHaveText(product.name);
      await expect(cartItem.locator('.inventory_item_desc')).toHaveText(product.description);
      await expect(cartItem.locator('.inventory_item_price')).toHaveText(product.price);
    }
  }

  async expectItemCount(count) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async expectCheckoutReady() {
    await expect(this.checkoutButton).toBeVisible();
    await expect(this.checkoutButton).toBeEnabled();
  }

  async removeItem(productId) {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await expect(removeButton).toHaveText('Remove');
    await removeButton.click();
  }

  async checkout() {
    await this.checkoutButton.click();
    await this.expectUrl('checkoutInformation');
    await this.expectTitle('Checkout: Your Information');
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
    await this.expectUrl('inventory');
  }
}