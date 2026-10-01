// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config(); // loads .env into process.env
const UI_URL = 'https://www.saucedemo.com';
const API_URL = 'https://restful-booker.herokuapp.com';
const AUTH_FILE = 'playwright/.auth/user.json';

export default defineConfig({
testDir: './tests',
fullyParallel: true,
forbidOnly: !!process.env.CI, // fail CI if someone left test.only
retries: process.env.CI ? 2 : 0, // retry only in CI
workers: process.env.CI ? 2 : undefined,
reporter: [['html', { open: 'never' }], ['list']],
use: {
trace: 'on-first-retry',
screenshot: 'only-on-failure',
video: 'retain-on-failure',
},
projects: [
// 1. Log in once and save the session
{
name: 'setup',
testMatch: /auth\.setup\.js/,
use: { baseURL: UI_URL },
},
// 2. UI tests, already logged in
{
name: 'e2e-chromium',
testDir: './tests/e2e',
dependencies: ['setup'],
use: { ...devices['Desktop Chrome'], baseURL: UI_URL, storageState:
AUTH_FILE },
},
{
name: 'e2e-firefox',
testDir: './tests/e2e',
dependencies: ['setup'],
use: { ...devices['Desktop Firefox'], baseURL: UI_URL, storageState:
AUTH_FILE },
},
// 3. API tests, no browser
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