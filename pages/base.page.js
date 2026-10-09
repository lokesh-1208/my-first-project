import { expect } from '@playwright/test';

const pageUrlPatterns = {
  inventory: /\/inventory\.html$/,
  cart: /\/cart\.html$/,
  checkoutInformation: /\/checkout-step-one\.html$/,
  checkoutOverview: /\/checkout-step-two\.html$/,
  checkoutComplete: /\/checkout-complete\.html$/,
};

export class BasePage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async expectUrl(pageName) {
    const urlPattern = pageUrlPatterns[pageName];

    if (!urlPattern) {
      throw new Error(`Unknown page name: ${pageName}`);
    }

    await expect(this.page).toHaveURL(urlPattern);
  }

  async expectTitle(title) {
    await expect(this.title).toHaveText(title);
  }

  async expectCartCount(count) {
    if (count === 0) {
      await expect(this.cartBadge).not.toBeVisible();
      return;
    }

    await expect(this.cartBadge).toHaveText(String(count));
  }
}