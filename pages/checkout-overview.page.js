import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class CheckoutOverviewPage extends BasePage {
  constructor(page) {
    super(page);
    this.overviewItems = page.locator('.cart_item');
    this.paymentAndShippingLabels = page.locator('.summary_info_label');
    this.paymentAndShippingValues = page.locator('.summary_value_label');
    this.subtotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
  }

  async expectProducts(expectedProducts) {
    await this.expectUrl('checkoutOverview');
    await this.expectTitle('Checkout: Overview');
    await expect(this.overviewItems).toHaveCount(expectedProducts.length);

    for (const [index, product] of expectedProducts.entries()) {
      const overviewItem = this.overviewItems.nth(index);
      await expect(overviewItem.locator('.inventory_item_name')).toHaveText(product.name);
      await expect(overviewItem.locator('.inventory_item_desc')).toHaveText(product.description);
      await expect(overviewItem.locator('.inventory_item_price')).toHaveText(product.price);
    }

    await expect(this.finishButton).toBeEnabled();
  }

  async expectOrderSummary(expectedProducts) {
    await expect(this.paymentAndShippingLabels).toHaveText([
      'Payment Information:',
      'Shipping Information:',
      'Price Total',
    ]);
    await expect(this.paymentAndShippingValues).toHaveText([
      'SauceCard #31337',
      'Free Pony Express Delivery!',
    ]);

    const subtotalCents = expectedProducts.reduce((total, product) => {
      return total + Math.round(Number(product.price.replace('$', '')) * 100);
    }, 0);
    const taxCents = Math.round(subtotalCents * 0.08);
    await this.expectAmountInCents(this.subtotal, 'Item total', subtotalCents);
    await this.expectAmountInCents(this.tax, 'Tax', taxCents);
    await this.expectAmountInCents(this.total, 'Total', subtotalCents + taxCents);
  }

  async expectAmountInCents(locator, label, expectedCents) {
    const displayedText = await locator.innerText();
    const amountPrefix = `${label}: $`;

    expect(displayedText.startsWith(amountPrefix)).toBe(true);
    const displayedCents = Math.round(Number(displayedText.slice(amountPrefix.length)) * 100);
    expect(displayedCents).toBe(expectedCents);
  }

  async finish() {
    await this.finishButton.click();
    await this.expectUrl('checkoutComplete');
  }
}