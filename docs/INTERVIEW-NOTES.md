# Interview / placement notes

Crib sheet for defending this project. Pair it with [payments.md](payments.md) and
[data-model.md](data-model.md) — be ready to whiteboard the donation verify→webhook flow and the
schemas from memory.

---

## 5 architecture decisions & their trade-offs

1. **Server-side payment signature verification.**
   The browser is untrusted, so "paid" is decided on the server by recomputing
   `HMAC_SHA256(order_id|payment_id, KEY_SECRET)` and comparing timing-safely.
   *Trade-off:* one extra round-trip (`/verify`) after checkout, vs the alternative of trusting the
   client (insecure) — an easy trade to make. A webhook backs it up so payment state is correct even
   if the user closes the tab.

2. **JWT in an httpOnly cookie, not localStorage.**
   The token can't be read by JS, which neutralises token theft via XSS.
   *Trade-off:* must handle CSRF considerations (`sameSite` cookie, and only state-changing admin
   routes are cookie-auth'd) and cross-site cookies in prod (`secure` + `sameSite=none`). localStorage
   would be simpler to wire but is XSS-exposed.

3. **Shared Zod schemas (client mirror + server source of truth).**
   The same rules give instant inline form errors *and* authoritative server validation.
   *Trade-off:* the schema lives in two files rather than one shared package — chosen so the two apps
   stay independently deployable without a build-time coupling. They're small and reviewed together.

4. **MongoDB + Mongoose, document-oriented and flat.**
   Submissions (donations/volunteers/contacts) and content (posts/events) are independent documents
   keyed by `slug`/id — no joins needed, reads are single-collection and fast, and the schema can
   evolve without migrations.
   *Trade-off:* no referential integrity at the DB layer; we don't need cross-entity transactions
   here, so the flexibility wins. A relational DB would shine if we had heavy relational reporting.

5. **Role-based access control (ADMIN/EDITOR), enforced on the server.**
   `requireRole('ADMIN')` gates deletes; EDITORs can create/edit content but not destroy. The UI hides
   what a role can't do, but the **server is the gate** — the client check is only UX.
   *Trade-off:* a fixed two-role model is simple; a permission matrix would scale to more roles but is
   overkill for this surface.

---

## The 3 hardest parts & how they were solved

1. **Webhook idempotency.** Razorpay delivers events at-least-once, and both `/verify` and the webhook
   can fire for the same payment. Solved with a status guard (`if status !== 'PAID'`), a
   `receiptSentAt` guard so the email sends exactly once, and a **unique sparse index** on
   `razorpayPaymentId` as a DB-level backstop.

2. **Verifying the webhook signature.** The HMAC must be computed over the *exact raw bytes* Razorpay
   signed — re-serialising parsed JSON changes the bytes. Solved by capturing `req.rawBody` in the
   `express.json({ verify })` hook and HMAC-ing that buffer.

3. **Cross-origin auth cookies in production.** Client (Vercel) and server (Render) are different
   origins, so the session cookie must be `secure` + `sameSite=none`, CORS must send
   `credentials: true` with an explicit origin, and Axios needs `withCredentials`. Getting all four
   aligned (and falling back to `sameSite=lax` in dev) is fiddly and easy to get subtly wrong.

---

## Scalability & next steps

- **Email queue.** Move transactional email to a background queue (BullMQ + Redis) so the request
  path never waits on SMTP and failures retry.
- **Caching.** Cache public reads (`/impact`, `/events`, `/posts`) in Redis or via HTTP cache headers;
  they change rarely.
- **i18n (Hindi/English).** High-value for an Indian NGO — `react-i18next` on the client, locale field
  on content.
- **Audit logs.** Record admin mutations (who changed what, when) for accountability.
- **Indexes & pagination.** Add compound indexes and cursor pagination to the admin lists as data
  grows; today they're full-collection sorts (fine at current scale).
- **Recurring donations.** Use Razorpay Subscriptions for true monthly billing (today MONTHLY is
  recorded but charged once).
- **Image uploads.** Move cover images from URLs to S3/Cloudinary with signed uploads.

---

## 8 likely questions (with crisp answers)

1. **Why store money in paise?** Integers avoid floating-point rounding bugs; `₹10.00` is `1000`
   paise, and formatting to rupees happens only at the edges.

2. **How do you stop a malicious client from claiming a ₹1 payment as ₹10,000?** The amount is
   computed server-side from the validated request and the order is created server-side; the
   signature ties the captured payment to *that* order id. The client never sends the final amount to
   `/verify`.

3. **What if the user closes the tab right after paying?** The webhook independently marks the
   donation `PAID` and sends the receipt — idempotently, so it's fine if `/verify` also ran.

4. **Why httpOnly cookies over a bearer token?** XSS can't read an httpOnly cookie, so a script
   injection can't exfiltrate the session. We accept the CSRF surface and mitigate with `sameSite`.

5. **How is spam handled on public forms?** A honeypot field (`website`) that must stay empty —
   validated by Zod — plus `express-rate-limit` per IP. Both are cheap and effective against bots.

6. **How does the impact counter stay editable without a redeploy?** Values live in the `ImpactStat`
   collection; `/api/impact` serves them and the admin edits them — the React component renders
   whatever the API returns.

7. **How do you keep the error responses consistent and safe?** A central `errorHandler` maps every
   error kind to one `{ error: { message, details? } }` envelope and never leaks stack traces to
   clients in production.

8. **How is the app tested?** Vitest unit tests for the amount math and Zod schemas; Supertest +
   an in-memory MongoDB for the donation/verify, webhook idempotency, and form endpoints; a Playwright
   e2e that drives the donate happy-path with Razorpay + API stubbed.
