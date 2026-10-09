import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    this.productCards = page.locator('.inventory_item');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortOptions = page.locator('[data-test="product-sort-container"] option');
  }

  async expectLoaded() {
    await this.expectUrl('inventory');
    await this.expectTitle('Products');
    await expect(this.page.getByText('Swag Labs', { exact: true })).toBeVisible();
  }

  async expectProductCatalog() {
    await this.expectLoaded();
    await expect(this.page.locator('[data-test="item-1-title-link"]')).toHaveText('Sauce Labs Bolt T-Shirt');
    await expect(this.page.locator('[data-test="item-2-title-link"]')).toHaveText('Sauce Labs Onesie');
    await expect(this.page.locator('[data-test="item-3-title-link"]')).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(this.page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(this.page.locator('[data-test="item-5-title-link"]')).toHaveText('Sauce Labs Fleece Jacket');
    await expect(this.page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
    await expect(this.page.getByText('A red light isn\'t the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.')).toBeVisible();
    await expect(this.page.getByText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.')).toBeVisible();
    await expect(this.page.getByText('Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won\'t unravel.')).toBeVisible();
    await expect(this.page.getByText('This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.')).toBeVisible();
    await expect(this.page.getByText('It\'s not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.')).toBeVisible();
    await expect(this.page.getByText('Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.')).toBeVisible();
    await expect(this.sortOptions).toHaveText([
      'Name (A to Z)',
      'Name (Z to A)',
      'Price (low to high)',
      'Price (high to low)',
    ]);
  }

  async expectProductPrices(products) {
    for (const product of products) {
      const productCard = this.productCards.filter({
        has: this.page.locator(`[data-test="add-to-cart-${product.id}"]`),
      });
      await expect(productCard.locator('.inventory_item_price')).toHaveText(product.price);
    }
  }

  async addItemToCart(productId) {
    const addButton = this.page.locator(`[data-test="add-to-cart-${productId}"]`);
    await expect(addButton).toHaveText('Add to cart');
    await addButton.click();
  }

  async removeItemFromCart(productId) {
    const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
    await expect(removeButton).toHaveText('Remove');
    await removeButton.click();
  }

  async addProducts(productIds) {
    const expectedProducts = [];

    for (const productId of productIds) {
      const productCard = this.productCards.filter({
        has: this.page.locator(`[data-test="add-to-cart-${productId}"]`),
      });
      expectedProducts.push({
        id: productId,
        name: await productCard.locator('.inventory_item_name').innerText(),
        description: await productCard.locator('.inventory_item_desc').innerText(),
        price: await productCard.locator('.inventory_item_price').innerText(),
      });
      await this.addItemToCart(productId);
    }

    await this.expectCartCount(productIds.length);
    return expectedProducts;
  }

  async openCart() {
    await this.cartLink.click();
    await this.expectUrl('cart');
    await this.expectTitle('Your Cart');
  }

  async expectMenuOptions() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await expect(this.page.locator('[data-test="inventory-sidebar-link"]')).toContainText('All Items');
    await expect(this.page.locator('[data-test="dynamic-catalog-sidebar-link"]')).toContainText('Dynamic Catalog');
    await this.page.locator('[data-test="dynamic-catalog-sidebar-link"]').click();
    await expect(this.page.locator('[data-test="dynamic-catalog-lazy-load-link"]')).toContainText('Lazy Load');
    await expect(this.page.locator('[data-test="dynamic-catalog-spinner-link"]')).toContainText('Spinner');
    await expect(this.page.locator('[data-test="dynamic-catalog-slider-link"]')).toContainText('Slider');
    await expect(this.page.locator('[data-test="about-sidebar-link"]')).toContainText('About');
    await expect(this.page.locator('[data-test="logout-sidebar-link"]')).toContainText('Logout');
    await expect(this.page.locator('[data-test="reset-sidebar-link"]')).toContainText('Reset App State');
    await this.page.getByRole('button', { name: 'Close Menu' }).click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.locator('[data-test="logout-sidebar-link"]').click();
    await expect(this.page.locator('[data-test="login-button"]')).toBeVisible();
  }
}