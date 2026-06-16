# Data model

All collections use Mongoose with `timestamps: true`. Money is stored in **paise** (integer) to avoid
floating-point errors. Indexed fields are marked `(idx)`.

```
┌─────────────┐        ┌──────────────┐        ┌──────────────┐
│    User     │        │   Donation   │        │  Volunteer   │
│ (admin/edit)│        │  (payments)  │        │  (sign-ups)  │
└─────────────┘        └──────────────┘        └──────────────┘
┌─────────────┐        ┌──────────────┐        ┌──────────────┐
│   Contact   │        │     Post     │        │    Event     │
│ (messages)  │        │  (mini-CMS)  │        │  (mini-CMS)  │
└─────────────┘        └──────────────┘        └──────────────┘
┌─────────────┐        ┌──────────────┐
│ ImpactStat  │        │ Transparency │
│ (counters)  │        │ (annual)     │
└─────────────┘        └──────────────┘
```

The model is intentionally **document-oriented and mostly flat** — there are no hard foreign-key
relations. Donations, volunteers and contacts are independent submission logs; content collections
(Post/Event) are standalone documents keyed by `slug`. This suits an NGO site where each record's
lifecycle is independent, and it keeps reads single-collection and fast.

## Schemas

### User
| Field | Type | Notes |
|---|---|---|
| name | String | |
| email | String | unique, lowercase (idx) |
| passwordHash | String | bcrypt, `select:false` |
| role | enum | `ADMIN` \| `EDITOR` |

Methods: `setPassword`, `verifyPassword`, `toSafeJSON`. The hash is stripped from all JSON output.

### Donation
| Field | Type | Notes |
|---|---|---|
| donorName, email (idx) | String | |
| pan | String | optional, for 80G receipts |
| amountInPaise | Number | min 100 |
| currency | String | default INR |
| frequency | enum | `ONE_TIME` \| `MONTHLY` |
| coverFee | Boolean | donor covers ~2% fee |
| razorpayOrderId (idx) | String | |
| razorpayPaymentId | String | **unique + sparse** → idempotency |
| status (idx) | enum | `CREATED` → `PAID` \| `FAILED` |
| receiptNo, receiptSentAt | String/Date | receipt bookkeeping |

Virtual `amountInRupees`. See [payments.md](payments.md) for the lifecycle.

### Volunteer
name, email (idx), phone, city, skills `[String]`, availability, message,
status `NEW → CONTACTED → ONBOARDED \| DECLINED`.

### Contact
name, email (idx), subject, body, `handled: Boolean` (idx).

### Post (news/blog)
type `NEWS|BLOG` (idx), title, slug (unique, idx), excerpt, body, coverImage, category, author,
published (idx), publishedAt, readingTimeMin. A `pre('save')` hook derives `readingTimeMin` from the
body (~200 wpm) and stamps `publishedAt` on first publish.

### Event
title, slug (unique, idx), description, startsAt (idx), location, type `UPCOMING|PAST` (idx),
coverImage, published (idx).

### ImpactStat
key (unique, idx), label, value `Number`, suffix (e.g. `+`), order. **Powers the public counters** —
editing `value` in the admin changes the site without a redeploy.

### Transparency
year (unique, idx), programPct, adminPct, fundraisingPct (validated to sum to 100 in the admin
validator), totalRaisedInPaise, reportUrl.

## Indexes
`User.email`, `Post.slug`, `Event.slug`, `Donation.razorpayOrderId`,
`Donation.razorpayPaymentId` (unique sparse), plus status/published/email lookups used by the admin
lists. These back the most common queries (slug lookups for detail pages, status filters for the
dashboard).
