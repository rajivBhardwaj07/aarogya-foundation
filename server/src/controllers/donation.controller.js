/**
 * Donations: create a Razorpay order, then verify the signed callback on the
 * server before marking the donation PAID and emailing an 80G receipt.
 * The client never decides payment success. See /docs/payments.md.
 */
import { asyncHandler, ApiError } from '../lib/ApiError.js';
import { getRazorpay, verifyPaymentSignature } from '../lib/razorpay.js';
import { sendDonationReceipt } from '../lib/mailer.js';
import { Donation } from '../models/Donation.js';
import { env } from '../lib/env.js';

const RAZORPAY_FEE_PCT = 0.02; // ~2% — added to the charge when the donor opts to cover it

/** POST /api/donations/order */
export const createOrder = asyncHandler(async (req, res) => {
  const { donorName, email, pan, amountInRupees, frequency, coverFee } = req.body;

  let amountInPaise = Math.round(amountInRupees * 100);
  if (coverFee) amountInPaise = Math.round(amountInPaise * (1 + RAZORPAY_FEE_PCT));

  const receiptNo = makeReceiptNo();
  const order = await getRazorpay().orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt: receiptNo,
    notes: { donorName, email, frequency },
  });

  const donation = await Donation.create({
    donorName,
    email,
    pan,
    amountInPaise,
    frequency,
    coverFee,
    razorpayOrderId: order.id,
    receiptNo,
    status: 'CREATED',
  });

  res.status(201).json({
    orderId: order.id,
    amountInPaise,
    currency: 'INR',
    keyId: env.razorpay.keyId,
    donationId: donation._id,
    donorName,
    email,
  });
});

/** POST /api/donations/verify */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const ok = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!ok) {
    await Donation.updateOne({ razorpayOrderId: razorpay_order_id }, { status: 'FAILED' });
    throw ApiError.badRequest('Payment verification failed. If you were charged, contact us.');
  }

  const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id });
  if (!donation) throw ApiError.notFound('Donation record not found.');

  // Idempotent: if the webhook already marked it paid, just return success.
  if (donation.status !== 'PAID') {
    donation.razorpayPaymentId = razorpay_payment_id;
    donation.razorpaySignature = razorpay_signature;
    donation.status = 'PAID';
    await donation.save();
    await sendReceiptOnce(donation);
  }

  res.json({
    status: 'PAID',
    receiptNo: donation.receiptNo,
    amountInPaise: donation.amountInPaise,
    donorName: donation.donorName,
  });
});

export async function sendReceiptOnce(donation) {
  if (donation.receiptSentAt) return;
  try {
    await sendDonationReceipt(donation);
    donation.receiptSentAt = new Date();
    await donation.save();
  } catch (err) {
    // Don't fail the request if email is down — receipt can be re-sent later.
    // eslint-disable-next-line no-console
    console.error('[donation] receipt email failed:', err.message);
  }
}

function makeReceiptNo() {
  const now = new Date();
  const fy = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `AF/${fy}-${String((fy + 1) % 100).padStart(2, '0')}/${rand}`;
}
