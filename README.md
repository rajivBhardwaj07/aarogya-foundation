# Aarogya Foundation — MERN Web App

A production-quality, full-stack web application for **Aarogya Foundation**, a (fictional but
realistically modelled) health/humanitarian NGO delivering primary healthcare to underserved
communities across Bihar, Jharkhand and eastern Uttar Pradesh, India.

Built as a placement-grade portfolio project: real Razorpay payments with **server-side signature
verification**, a JWT admin dashboard, a clean REST API, well-modelled Mongoose schemas,
accessibility, tests, and a bespoke design system.

> **Stack:** MongoDB · Express · React · Node — **JavaScript throughout** (no TypeScript).

---

## ✨ Features

- **Public website** — home (with the signature *lifeline* hero), about, programmes, impact &
  transparency, events + news, donate, get-involved, privacy, terms. Responsive to 360px,
  keyboard-accessible, SEO metadata + JSON-LD.
- **Online donations (Razorpay)** — preset/custom amounts, one-time vs monthly, optional fee-cover,
  PAN for 80G. Order created server-side → Razorpay Checkout → **HMAC signature verified on the
  server** → donation recorded → 80G receipt emailed → idempotent webhook.
- **Volunteer & contact forms** — shared Zod validation, honeypot + rate-limit spam protection,
  confirmation + admin-notification emails.
- **Mini-CMS** — events and news/blog posts with slugs, publish flags, reading time.
- **Impact & transparency** — animated counters driven by the database, a fund-allocation chart
  (Recharts), downloadable annual reports, and registration details.
- **Admin dashboard** — JWT (httpOnly cookie) login, RBAC (ADMIN/EDITOR), overview metrics, CRUD for
  content, read views for submissions, and CSV export.

---

## 🗂 Repository structure

```
aarogya-foundation/
├── client/            React 18 + Vite + Tailwind (JavaScript)
│   └── src/
│       ├── components/  pages/  hooks/  context/  lib/   (api, validators, format)
│       └── e2e/         Playwright tests
├── server/            Node + Express + Mongoose (JavaScript)
│   └── src/
│       ├── models/  routes/  controllers/  middleware/  lib/  validators/
│       ├── seed.js
│       └── __tests__/   Vitest + Supertest
├── docs/              architecture, data-model, payments, design-system, INTERVIEW-NOTES
└── README.md
```

See [docs/architecture.md](docs/architecture.md) for the request flow and key decisions.

---

## 🚀 Quick start (from a clean clone)

### Prerequisites
- Node.js ≥ 18
- A MongoDB instance — local, Docker (`docker compose up -d`), or [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Install
```bash
npm install            # root install hoists both workspaces (client + server)
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```
Fill in `MONGODB_URI`, a `JWT_SECRET`, and (for payments) your Razorpay **test** keys. Email is
optional — leave `SMTP_HOST` blank and emails are logged to the console instead of sent.

### 3. Seed realistic data
```bash
npm run seed           # creates admin/editor users, impact stats, events, posts, sample submissions
```

### 4. Run both apps
```bash
npm run dev            # server on :5000, client on :5173 (Vite proxies /api → server)
```
Open http://localhost:5173. Admin: http://localhost:5173/admin/login
(`admin@aarogyafoundation.org` / `Admin@12345` from the seed).

---

## 📜 Scripts

| Command | Where | Does |
|---|---|---|
| `npm run dev` | root | Run client + server together (concurrently) |
| `npm run build` | root | Build the client for production |
| `npm start` | root | Start the server (production) |
| `npm run seed` | root | Seed the database |
| `npm test` | root | Run server + client unit/API tests |
| `npm run lint` | root | Lint both apps |
| `npm run test:e2e` | client | Playwright donate-flow e2e (`npx playwright install chromium` first) |

---

## 🔑 Environment variables

**server/.env** — `NODE_ENV`, `PORT`, `CLIENT_URL`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
seed admin/editor creds, `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` / `RAZORPAY_WEBHOOK_SECRET`,
`SMTP_*`, `MAIL_FROM`, `ADMIN_NOTIFY_EMAIL`.

**client/.env** — `VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_SITE_URL`.

Full annotated lists live in the two `.env.example` files.

---

## 🧪 Testing

- **Unit (Vitest):** donation-amount math + Zod validators (client & server).
- **API (Supertest + in-memory MongoDB):** donation order/verify, webhook signature + idempotency,
  volunteer create + honeypot rejection.
- **E2E (Playwright):** the full donate happy-path through the UI (Razorpay + API stubbed).

```bash
npm test                         # all unit + API tests
cd client && npm run test:e2e    # e2e
```

---

## ☁️ Deployment

| Piece | Service | Notes |
|---|---|---|
| Database | MongoDB Atlas | Free M0 tier; whitelist your server IP |
| Server | Render / Railway | Root dir `server`, build `npm install`, start `npm start` |
| Client | Vercel / Netlify | Root dir `client`, build `npm run build`, output `dist` |

After deploy, set the Razorpay **webhook** URL to `https://<your-server>/api/webhooks/razorpay`
with the `payment.captured` and `payment.failed` events, and put the signing secret in
`RAZORPAY_WEBHOOK_SECRET`. Set the client's `VITE_API_URL` to the deployed server URL and the
server's `CLIENT_URL` to the deployed client URL (so CORS + cookies line up). See
[docs/payments.md](docs/payments.md).

---

## 📚 Docs

- [docs/architecture.md](docs/architecture.md) — request flow, folders, auth, decisions
- [docs/data-model.md](docs/data-model.md) — Mongoose schemas + relations
- [docs/payments.md](docs/payments.md) — Razorpay order→verify→webhook, how to test
- [docs/design-system.md](docs/design-system.md) — tokens, type scale, the lifeline, a11y
- [docs/INTERVIEW-NOTES.md](docs/INTERVIEW-NOTES.md) — decisions, hard parts, likely questions

---

## 📝 License

For portfolio/educational use. "Aarogya Foundation", its registration numbers, and the figures in
the seed data are illustrative placeholders.
