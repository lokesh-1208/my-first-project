import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { CartPage } from '../../pages/cart.page.js';
import { CheckoutCompletePage } from '../../pages/checkout-complete.page.js';
import { CheckoutInformationPage } from '../../pages/checkout-information.page.js';
import { CheckoutOverviewPage } from '../../pages/checkout-overview.page.js';
import { InventoryPage } from '../../pages/inventory.page.js';
import { LoginPage } from '../../pages/login.page.js';
import { productIds } from '../../test-data/products.js';
import { pickRandomItems } from '../../test-data/product-selection.js';

async function openOrderOverview(page) {
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
	await checkoutPage.fillInformation({
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		postalCode: faker.string.numeric(5),
	});
	await checkoutPage.continueToOverview();

	const overviewPage = new CheckoutOverviewPage(page);
	await overviewPage.expectProducts(expectedProducts);
	return { expectedProducts, overviewPage };
}

test.describe('Purchase flow', () => {
	test('Checkout overview displays products, payment, shipping, and totals', async ({ page }) => {
		const { expectedProducts, overviewPage } = await openOrderOverview(page);
		await overviewPage.expectOrderSummary(expectedProducts);
	});

	test('Finish purchase displays the checkout complete confirmation', async ({ page }) => {
		const { overviewPage } = await openOrderOverview(page);
		await overviewPage.finish();

		const completePage = new CheckoutCompletePage(page);
		await completePage.expectConfirmation();
	});

	test('Generate a PDF of the checkout complete page', async ({ page, browserName }, testInfo) => {
		test.skip(browserName !== 'chromium', 'Playwright PDF generation is supported only in Chromium.');

		const { overviewPage } = await openOrderOverview(page);
		await overviewPage.finish();

		const completePage = new CheckoutCompletePage(page);
		await completePage.expectConfirmation();

		const pdf = await page.pdf({
			path: testInfo.outputPath('checkout-complete.pdf'),
			printBackground: true,
		});
		expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
	});

	test('Back Home returns to the inventory after purchase', async ({ page }) => {
		const { overviewPage } = await openOrderOverview(page);
		await overviewPage.finish();

		const completePage = new CheckoutCompletePage(page);
		await completePage.expectConfirmation();
		await completePage.backHome();
	});
});
