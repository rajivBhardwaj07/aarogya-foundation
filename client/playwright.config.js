import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright e2e config. Boots the Vite dev server; the donate spec stubs all
 * /api calls and the Razorpay SDK, so no live keys or backend are needed.
 * First run: `npx playwright install chromium`.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
