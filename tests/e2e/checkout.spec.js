
import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CartPage } from '../../pages/cart.page.js';
import { CheckoutInformationPage } from '../../pages/checkout-information.page.js';
import { CheckoutOverviewPage } from '../../pages/checkout-overview.page.js';
import { InventoryPage } from '../../pages/inventory.page.js';
import { LoginPage } from '../../pages/login.page.js';
import { productIds } from '../../test-data/products.js';
import { pickRandomItems } from '../../test-data/product-selection.js';

async function openCheckoutInformation(page) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login();

  const inventoryPage = new InventoryPage(page);
  const expectedProducts = await inventoryPage.addProducts(pickRandomItems(productIds, 2));
  await inventoryPage.openCart();

  const cartPage = new CartPage(page);
  await cartPage.expectProducts(expectedProducts);
  await cartPage.checkout();

  const checkoutPage = new CheckoutInformationPage(page);
  await checkoutPage.expectLoaded();
  return { checkoutPage, expectedProducts };
}

test.describe('Checkout behavior', () => {
  test('Navigate to checkout information after adding products to cart', async ({ page }) => {
    const { checkoutPage } = await openCheckoutInformation(page);
    await checkoutPage.expectReady();
  });

  test('Validate required checkout information when continuing with blank fields', async ({ page }) => {
    const { checkoutPage } = await openCheckoutInformation(page);
    await checkoutPage.expectRequiredFieldErrors();
  });

  test('Continue to order overview after filling checkout information', async ({ page }) => {
    const { checkoutPage, expectedProducts } = await openCheckoutInformation(page);
    await checkoutPage.fillInformation({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.string.numeric(5),
    });
    await checkoutPage.continueToOverview();

    const overviewPage = new CheckoutOverviewPage(page);
    await overviewPage.expectProducts(expectedProducts);
  });

  test('Cancel checkout information and return to the cart', async ({ page }) => {
    const { checkoutPage } = await openCheckoutInformation(page);
    await checkoutPage.cancelToCart(2);
  });
});

