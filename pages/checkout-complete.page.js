import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CheckoutCompletePage extends BasePage {
  constructor(page) {
    super(page);
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationMessage = page.locator('.complete-text');
    this.confirmationImage = page.locator('.pony_express');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async expectConfirmation() {
    await this.expectUrl('checkoutComplete');
    await this.expectTitle('Checkout: Complete!');
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(this.confirmationMessage)
      .toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    await expect(this.confirmationImage).toBeVisible();
    await expect(this.backHomeButton).toBeEnabled();
  }

  async backHome() {
    await this.backHomeButton.click();
    await this.expectUrl('inventory');
    await this.expectTitle('Products');
    await this.expectCartCount(0);
  }
}