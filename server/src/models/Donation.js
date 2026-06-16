/**
 * Donation — a single donation lifecycle record.
 * Amounts are stored in PAISE (integer) to avoid floating-point money bugs.
 * status: CREATED (order made) → PAID (signature verified) | FAILED.
 * razorpayPaymentId is unique+sparse for webhook idempotency.
 * See /docs/payments.md.
 */
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    pan: { type: String, trim: true, uppercase: true }, // optional, for 80G receipts
    amountInPaise: { type: Number, required: true, min: 100 },
    currency: { type: String, default: 'INR' },
    frequency: { type: String, enum: ['ONE_TIME', 'MONTHLY'], default: 'ONE_TIME' },
    coverFee: { type: Boolean, default: false },

    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    razorpaySignature: { type: String },

    status: { type: String, enum: ['CREATED', 'PAID', 'FAILED'], default: 'CREATED', index: true },
    receiptNo: { type: String },
    receiptSentAt: { type: Date },
  },
  { timestamps: true }
);

donationSchema.virtual('amountInRupees').get(function amountInRupees() {
  return this.amountInPaise / 100;
});

donationSchema.set('toJSON', { virtuals: true });

export const Donation = mongoose.model('Donation', donationSchema);
