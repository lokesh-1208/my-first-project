// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const UI_URL = 'https://www.saucedemo.com';
const API_URL = 'https://restful-booker.herokuapp.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: UI_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'e2e-chromium',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: UI_URL,
      },
    },
    {
      name: 'e2e-firefox',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: UI_URL,
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: API_URL,
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});