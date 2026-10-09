# Playwright Automation Framework

This project automates the Sauce Demo storefront with Playwright Test and JavaScript. The end-to-end suite uses the Page Object Model (POM) to keep UI selectors and page behavior separate from test scenarios.

## Automation Approach

- Each class in `pages/` represents a screen or shared page behavior. Page objects own their locators, actions, and UI assertions.
- `BasePage` provides common behavior such as URL, title, and cart-count checks. Screen-specific classes extend it.
- Specs in `tests/e2e/` describe user scenarios and compose page objects. They avoid defining UI selectors directly.
- Product IDs and expected prices live in `test-data/products.js`; `test-data/product-selection.js` selects a random subset for cart scenarios.
- Faker creates checkout names and postal codes so valid checkout cases do not rely on fixed personal data.
- The checkout flow is split into information, overview, and completion page objects. The purchase-flow suite also checks the confirmation page and the Chromium-generated PDF artifact.

## Project Structure

```text
pages/
  base.page.js
  login.page.js
  inventory.page.js
  cart.page.js
  checkout-information.page.js
  checkout-overview.page.js
  checkout-complete.page.js
test-data/
  products.js
  product-selection.js
tests/e2e/
  loginpage.spec.js
  inventory.spec.js
  cart.spec.js
  checkout.spec.js
  purchase-flow.spec.js
```

## Setup

Install dependencies:

```bash
npm install
npx playwright install chromium firefox
```

Create `.env` from `.env.example` and provide the Sauce Demo credentials:

```powershell
Copy-Item .env.example .env
```

The UI base URL defaults to `https://www.saucedemo.com/`. Set `BASE_URL` in `.env` to override it. Keep `.env` local and do not commit credentials.

## Running Tests

Run the configured test projects:

```bash
npm test
```

Run the UI E2E suite or a focused spec:

```bash
npm test -- tests/e2e
npm test -- tests/e2e/checkout.spec.js
npm test -- tests/e2e/purchase-flow.spec.js --project=e2e-chromium
```

Run tests with a visible browser:

```bash
npm run test:headed -- tests/e2e
```

The Playwright configuration runs E2E tests in Chromium and Firefox, retries failures in CI, and records traces on retry plus screenshots and video on failure. The PDF-generation case is Chromium-only because Playwright's `page.pdf()` API is supported by Chromium.

Open the HTML report after a run:

```bash
npx playwright show-report
```