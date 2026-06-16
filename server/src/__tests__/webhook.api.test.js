/**
 * Webhook tests: signature enforcement + idempotency (the same captured event
 * delivered twice must not double-process). See /docs/payments.md.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import request from 'supertest';
import { createApp } from '../app.js';
import { Donation } from '../models/Donation.js';

const app = createApp();
const WEBHOOK_SECRET = 'webhooksecret';

function webhookBody(orderId, paymentId) {
  return {
    event: 'payment.captured',
    payload: { payment: { entity: { id: paymentId, order_id: orderId } } },
  };
}

function sign(raw) {
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(raw).digest('hex');
}

describe('POST /api/webhooks/razorpay', () => {
  beforeEach(async () => {
    await Donation.create({
      donorName: 'Asha Devi',
      email: 'asha@example.com',
      amountInPaise: 100000,
      razorpayOrderId: 'order_wh_1',
      receiptNo: 'AF/2024-25/777777',
      status: 'CREATED',
    });
  });

  it('rejects an invalid signature', async () => {
    const body = JSON.stringify(webhookBody('order_wh_1', 'pay_wh_1'));
    const res = await request(app)
      .post('/api/webhooks/razorpay')
      .set('x-razorpay-signature', 'wrong')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(401);
  });

  it('marks PAID on a valid captured event and is idempotent on redelivery', async () => {
    const body = JSON.stringify(webhookBody('order_wh_1', 'pay_wh_1'));
    const signature = sign(body);

    const first = await request(app)
      .post('/api/webhooks/razorpay')
      .set('x-razorpay-signature', signature)
      .set('Content-Type', 'application/json')
      .send(body);
    expect(first.status).toBe(200);

    let doc = await Donation.findOne({ razorpayOrderId: 'order_wh_1' });
    expect(doc.status).toBe('PAID');
    const firstReceiptSentAt = doc.receiptSentAt?.getTime();

    // Redeliver the exact same event — must not re-send the receipt.
    const second = await request(app)
      .post('/api/webhooks/razorpay')
      .set('x-razorpay-signature', signature)
      .set('Content-Type', 'application/json')
      .send(body);
    expect(second.status).toBe(200);

    doc = await Donation.findOne({ razorpayOrderId: 'order_wh_1' });
    expect(doc.status).toBe('PAID');
    expect(doc.receiptSentAt?.getTime()).toBe(firstReceiptSentAt);
  });
});
