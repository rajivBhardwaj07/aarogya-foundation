# Architecture

## Overview

A two-app monorepo (npm workspaces):

- **client/** — React 18 SPA (Vite), React Router, TanStack Query, Tailwind. Talks to the API over
  Axios with `withCredentials` so the auth cookie rides along.
- **server/** — Express REST API with Mongoose. Stateless except for the JWT cookie; all state in
  MongoDB.

```
Browser ── React SPA ──HTTP(/api)──▶ Express ──▶ Mongoose ──▶ MongoDB
                  │                      │
                  │                      ├─▶ Razorpay (orders, signature verify)
                  └─ Razorpay Checkout ──┘
                                         └─▶ Nodemailer (receipts, confirmations)
```

## Request flow

1. The SPA calls `/api/...` via the Axios client (`client/src/lib/api.js`).
2. In dev, Vite proxies `/api` → `http://localhost:5000` (same origin → cookies just work). In prod,
   `VITE_API_URL` points at the deployed server and CORS is configured with `credentials: true`.
3. Express middleware order (`server/src/app.js`):
   `helmet` → `cors` → `express.json` (captures `rawBody` for webhooks) → `cookieParser` →
   `morgan` → `/api` router → `notFound` → `errorHandler`.
4. Each route runs: **rate limiter** (public writes) → **Zod validation middleware** → **auth/role**
   (admin only) → **controller**.
5. Controllers are thin; they use models + lib helpers and either `res.json(...)` or `throw`
   an `ApiError`, which the central error handler formats.

## Folder map (server)

| Folder | Responsibility |
|---|---|
| `models/` | Mongoose schemas (one file per collection) |
| `validators/` | Zod schemas — the single source of truth, shared in spirit with the client |
| `middleware/` | `auth` (JWT + RBAC), `validate` (Zod), `rateLimit`, `errorHandler` |
| `controllers/` | Business logic per feature |
| `routes/` | Express routers, one per feature, aggregated in `routes/index.js` |
| `lib/` | `db`, `razorpay`, `mailer`, `env`, `ApiError` |
| `seed.js` | Realistic seed data for every model |

## Folder map (client)

| Folder | Responsibility |
|---|---|
| `pages/` | Route components (public + `admin/`) — lazy-loaded for code-splitting |
| `components/` | Reusable UI (Header, Footer, Lifeline, Field, CountUp, Seo, ui helpers) |
| `context/` | `AuthContext` — current admin user from the cookie session |
| `lib/` | `api` (Axios + endpoints), `validators` (Zod mirror), `format`, `site`, `razorpay` loader |

## Auth model

- **JWT in an httpOnly, sameSite cookie** (not localStorage) → not reachable from JS, XSS-resistant.
- `requireAuth` verifies the cookie and loads the user; `requireRole('ADMIN')` gates destructive
  actions. The client *also* hides admin-only UI, but the **server is the enforcement point**.
- Passwords are bcrypt-hashed (cost 12) and never serialised (`select: false` + `toJSON` strip).
- In production the cookie is `secure` + `sameSite=none` so the Vercel client and Render server
  (different origins) can share it over HTTPS.

## Shared validation

The Zod schemas in `server/src/validators/index.js` are mirrored in `client/src/lib/validators.js`.
The client uses them with `react-hook-form` for instant inline errors; the server re-validates every
request independently (never trust the client). Keeping one rule-set in two places (rather than a
build-time shared package) keeps the two apps independently deployable.

## Error handling

`errorHandler` produces one envelope shape — `{ error: { message, details? } }` — and maps:
ZodError/Mongoose ValidationError → 400 with field details, duplicate key → 409, `ApiError` →
its status, everything else → 500 with a generic message (stack only in non-prod, never to clients
in prod). The Axios interceptor unwraps this into a thrown `Error` with `.details`.

## SEO

`react-helmet-async` sets per-page `<title>`, description, Open Graph and Twitter tags, canonical,
and JSON-LD (Organization on home, Event on event detail). `public/robots.txt` and
`public/sitemap.xml` are served statically.

## Performance

- Routes are `React.lazy` + `Suspense` → code-split bundles (Recharts only loads on `/impact`).
- TanStack Query caches API responses with a 60s stale time.
- Images are lazy-loaded; fonts are preconnected.

## Configuration & secrets

`server/src/lib/env.js` loads `.env` once and exposes a single `env` object; it warns (doesn't crash)
on missing optional vars so the app boots in dev with minimal config. Secrets never enter the repo
(`.env` is git-ignored; `.env.example` documents every key).
