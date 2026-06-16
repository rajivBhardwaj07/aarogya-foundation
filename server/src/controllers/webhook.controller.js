/**
 * Razorpay webhook — the source of truth for payment state, independent of the
 * browser. Verifies the signature against the RAW body, then updates the
 * Donation idempotently (safe to receive the same event many times).
 * See /docs/payments.md — "Webhook idempotency".
 */
import { asyncHandler, ApiError } from '../lib/ApiError.js';
import { verifyWebhookSignature } from '../lib/razorpay.js';
import { Donation } from '../models/Donation.js';
import { sendReceiptOnce } from './donation.controller.js';

export const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const raw = req.rawBody;
  if (!raw || !verifyWebhookSignature(raw, signature)) {
    throw ApiError.unauthorized('Invalid webhook signature.');
  }

  const event = req.body?.event;
  const payment = req.body?.payload?.payment?.entity;

  // Ack quickly; only act on payment lifecycle events we care about.
  if (event === 'payment.captured' || event === 'order.paid') {
    const orderId = payment?.order_id;
    const paymentId = payment?.id;
    if (orderId) {
      const donation = await Donation.findOne({ razorpayOrderId: orderId });
      // Idempotency guard: only the FIRST transition to PAID does work.
      if (donation && donation.status !== 'PAID') {
        donation.status = 'PAID';
        if (paymentId) donation.razorpayPaymentId = paymentId;
        await donation.save();
        await sendReceiptOnce(donation);
      }
    }
  } else if (event === 'payment.failed') {
    const orderId = payment?.order_id;
    if (orderId) {
      await Donation.updateOne(
        { razorpayOrderId: orderId, status: { $ne: 'PAID' } },
        { status: 'FAILED' }
      );
    }
  }

  res.json({ received: true });
});
