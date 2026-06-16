# Payments (Razorpay)

The donation flow is built so the **server**, never the browser, decides that a payment succeeded.

## The flow

```
Client (Donate.jsx)                Server                         Razorpay
───────────────────────────────────────────────────────────────────────────
1. fill form ─────────────▶ POST /api/donations/order
                            ├ Zod-validate, compute paise
                            ├ create Donation {status: CREATED}
                            └ razorpay.orders.create() ─────────▶ creates order
                            ◀───────────────────────────────────  order.id
2. open Checkout ◀─ orderId,keyId
   (Razorpay modal) ──────────────────────────────────────────▶ user pays
   handler(resp) ◀────────────────────────────────────────────  order_id,
                                                                  payment_id,
                                                                  signature
3. send resp ─────────────▶ POST /api/donations/verify
                            ├ HMAC_SHA256(order_id|payment_id, KEY_SECRET)
                            │   === signature ?   (timing-safe compare)
                            ├ if ok: Donation → PAID, email 80G receipt
                            └ if not: Donation → FAILED, 400
   redirect /thank-you ◀── {status: PAID, receiptNo, amount}

  Meanwhile, asynchronously and independently:
                            POST /api/webhooks/razorpay  ◀─────── payment.captured
                            ├ HMAC_SHA256(rawBody, WEBHOOK_SECRET) === header ?
                            └ idempotently set PAID + email receipt once
```

## Why verify on the server

The Checkout handler runs in the user's browser and could be tampered with or replayed. The
`razorpay_signature` is an HMAC the client cannot forge without `KEY_SECRET` (which lives only on the
server). We recompute it (`server/src/lib/razorpay.js → verifyPaymentSignature`) using a
**timing-safe** comparison before flipping `status` to `PAID`. Amounts are computed server-side from
the validated request, never taken from the client's claimed total.

## Webhook idempotency (the interesting part)

Razorpay may deliver the same webhook **multiple times** (retries, at-least-once delivery), and the
verify call and the webhook can both arrive for the same payment. So every transition to `PAID` is
guarded:

```js
if (donation && donation.status !== 'PAID') {   // only the FIRST time does work
  donation.status = 'PAID';
  await donation.save();
  await sendReceiptOnce(donation);              // receiptSentAt guards the email
}
```

- The status guard means re-processing a `PAID` donation is a no-op.
- `sendReceiptOnce` checks `receiptSentAt` so the receipt email is sent exactly once even if both the
  verify endpoint and the webhook (and a webhook retry) all fire.
- `razorpayPaymentId` is a **unique sparse index**, a database-level backstop against duplicates.

The webhook signature is computed over the **raw request body** (captured in `app.js` via the
`express.json({ verify })` hook), because re-serialising the parsed JSON would change the bytes and
break the HMAC.

## How to test

### Automated
`server/src/__tests__/donations.api.test.js` and `webhook.api.test.js` mock the Razorpay SDK,
compute real signatures with a test secret, and assert: valid signature → `PAID`, forged →
`FAILED`/`401`, and that a redelivered webhook does not re-send the receipt.

### Manually (test mode)
1. Put Razorpay **test** keys in `server/.env` and `VITE_RAZORPAY_KEY_ID` in `client/.env`.
2. `npm run dev`, open `/donate`, use a [Razorpay test card](https://razorpay.com/docs/payments/payments/test-card-details/)
   (e.g. `4111 1111 1111 1111`, any future expiry/CVV).
3. Confirm a `paid` Donation appears in the admin dashboard and a receipt is logged/emailed.
4. For webhooks locally, expose the server with a tunnel (e.g. `ngrok http 5000`) and register
   `https://<tunnel>/api/webhooks/razorpay` in the Razorpay dashboard with the signing secret in
   `RAZORPAY_WEBHOOK_SECRET`.
