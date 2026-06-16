/**
 * E2E: the donation happy path, end to end through the UI.
 * We stub the Razorpay Checkout SDK (so it instantly "succeeds") and mock the
 * server's /order and /verify endpoints, proving the client flow:
 *   fill form → create order → open checkout → verify → /thank-you.
 */
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Stub the external Razorpay SDK before any app code runs.
  await page.addInitScript(() => {
    window.Razorpay = function (options) {
      return {
        on() {},
        open() {
          // Simulate a successful payment callback immediately.
          options.handler({
            razorpay_order_id: options.order_id,
            razorpay_payment_id: 'pay_e2e_123',
            razorpay_signature: 'sig_e2e_123',
          });
        },
      };
    };
  });

  // Prevent the real checkout.js from loading.
  await page.route('https://checkout.razorpay.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
  );

  await page.route('**/api/donations/order', (route) =>
    route.fulfill({
      json: {
        orderId: 'order_e2e_1',
        amountInPaise: 100000,
        currency: 'INR',
        keyId: 'rzp_test_e2e',
        donorName: 'Asha Devi',
        email: 'asha@example.com',
      },
    })
  );

  await page.route('**/api/donations/verify', (route) =>
    route.fulfill({
      json: { status: 'PAID', receiptNo: 'AF/2024-25/E2E001', amountInPaise: 100000, donorName: 'Asha Devi' },
    })
  );
});

test('donor completes a one-time donation and reaches the thank-you page', async ({ page }) => {
  await page.goto('/donate');

  await expect(page.getByRole('heading', { name: /put a doctor at someone/i })).toBeVisible();

  // Pick a preset amount and fill donor details.
  await page.getByRole('button', { name: '₹1,000', exact: true }).click();
  await page.getByLabel('Full name').fill('Asha Devi');
  await page.getByLabel('Email', { exact: true }).fill('asha@example.com');

  await page.getByRole('button', { name: /Donate ₹1,000/ }).click();

  // The stubbed Razorpay handler fires verify → navigate to /thank-you.
  await expect(page).toHaveURL(/\/thank-you/);
  await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible();
  await expect(page.getByText('AF/2024-25/E2E001')).toBeVisible();
});
