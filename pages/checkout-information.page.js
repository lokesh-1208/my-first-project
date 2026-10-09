import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { BasePage } from './base.page.js';

export class CheckoutInformationPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.cartItems = page.locator('.cart_item');
  }

  async expectLoaded() {
    await this.expectUrl('checkoutInformation');
    await this.expectTitle('Checkout: Your Information');
  }

  async expectReady() {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
  }

  async expectRequiredFieldErrors() {
    await this.continueButton.click();
    await expect(this.errorMessage).toHaveText('Error: First Name is required');

    await this.firstNameInput.fill(faker.person.firstName());
    await this.continueButton.click();
    await expect(this.errorMessage).toHaveText('Error: Last Name is required');

    await this.lastNameInput.fill(faker.person.lastName());
    await this.continueButton.click();
    await expect(this.errorMessage).toHaveText('Error: Postal Code is required');
  }

  async fillInformation(information) {
    await this.firstNameInput.fill(information.firstName);
    await this.lastNameInput.fill(information.lastName);
    await this.postalCodeInput.fill(information.postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
    await this.expectUrl('checkoutOverview');
    await this.expectTitle('Checkout: Overview');
  }

  async cancelToCart(expectedProductCount) {
    await this.cancelButton.click();
    await this.expectUrl('cart');
    await this.expectTitle('Your Cart');
    await expect(this.cartItems).toHaveCount(expectedProductCount);
  }
}