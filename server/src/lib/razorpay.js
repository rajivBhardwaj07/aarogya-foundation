/**
 * Razorpay client + signature helpers.
 * Verification is done HERE on the server using HMAC-SHA256 — the client is
 * never trusted to declare a payment "paid". See /docs/payments.md.
 */
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { env } from './env.js';

let instance = null;

/** Lazily construct the Razorpay SDK client (skipped if keys are absent). */
export function getRazorpay() {
  if (instance) return instance;
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw new Error('Razorpay keys are not configured (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).');
  }
  instance = new Razorpay({ key_id: env.razorpay.keyId, key_secret: env.razorpay.keySecret });
  return instance;
}

/**
 * Verify the checkout callback signature:
 *   HMAC_SHA256(order_id + "|" + payment_id, key_secret) === razorpay_signature
 */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const expected = crypto
    .createHmac('sha256', env.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return timingSafeEqual(expected, signature);
}

/**
 * Verify a webhook payload signature:
 *   HMAC_SHA256(rawBody, webhook_secret) === x-razorpay-signature
 */
export function verifyWebhookSignature(rawBody, signature) {
  if (!env.razorpay.webhookSecret) return false;
  const expected = crypto
    .createHmac('sha256', env.razorpay.webhookSecret)
    .update(rawBody)
    .digest('hex');
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a, b) {
  if (!a || !b) return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
