/**
 * API tests for the donation flow: create order → verify signed callback.
 * Razorpay's network SDK is mocked; the real HMAC verification runs so we
 * prove the server — not the client — decides "PAID".
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import request from 'supertest';

// Mock only the SDK constructor; keep the real signature helpers.
vi.mock('../lib/razorpay.js', async (importActual) => {
  const actual = await importActual();
  return {
    ...actual,
    getRazorpay: () => ({
      orders: {
        create: vi.fn(async (opts) => ({ id: 'order_test_123', ...opts })),
      },
    }),
  };
});

const { createApp } = await import('../app.js');
const { Donation } = await import('../models/Donation.js');

const app = createApp();
const SECRET = 'testsecret';

function sign(orderId, paymentId) {
  return crypto.createHmac('sha256', SECRET).update(`${orderId}|${paymentId}`).digest('hex');
}

describe('POST /api/donations/order', () => {
  it('creates a CREATED donation and returns the order id', async () => {
    const res = await request(app).post('/api/donations/order').send({
      donorName: 'Asha Devi',
      email: 'asha@example.com',
      amountInRupees: 1000,
    });
    expect(res.status).toBe(201);
    expect(res.body.orderId).toBe('order_test_123');
    expect(res.body.amountInPaise).toBe(100000);

    const doc = await Donation.findOne({ razorpayOrderId: 'order_test_123' });
    expect(doc.status).toBe('CREATED');
  });

  it('rejects an amount below the minimum', async () => {
    const res = await request(app)
      .post('/api/donations/order')
      .send({ donorName: 'X', email: 'x@example.com', amountInRupees: 10 });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/donations/verify', () => {
  beforeEach(async () => {
    await Donation.create({
      donorName: 'Asha Devi',
      email: 'asha@example.com',
      amountInPaise: 100000,
      razorpayOrderId: 'order_test_123',
      receiptNo: 'AF/2024-25/999999',
      status: 'CREATED',
    });
  });

  it('marks the donation PAID for a valid signature', async () => {
    const res = await request(app)
      .post('/api/donations/verify')
      .send({
        razorpay_order_id: 'order_test_123',
        razorpay_payment_id: 'pay_test_1',
        razorpay_signature: sign('order_test_123', 'pay_test_1'),
      });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('PAID');

    const doc = await Donation.findOne({ razorpayOrderId: 'order_test_123' });
    expect(doc.status).toBe('PAID');
    expect(doc.razorpayPaymentId).toBe('pay_test_1');
  });

  it('rejects a forged signature and marks FAILED', async () => {
    const res = await request(app).post('/api/donations/verify').send({
      razorpay_order_id: 'order_test_123',
      razorpay_payment_id: 'pay_test_1',
      razorpay_signature: 'deadbeefdeadbeef',
    });
    expect(res.status).toBe(400);

    const doc = await Donation.findOne({ razorpayOrderId: 'order_test_123' });
    expect(doc.status).toBe('FAILED');
  });
});
