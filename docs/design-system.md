# Design system

**Direction:** warm, dignified, trustworthy — *humane health*, deliberately not the
corporate-blue-and-green clichés of most NGO/health sites.

## Palette (Tailwind tokens + CSS variables)

| Token | Hex | Role |
|---|---|---|
| `ink` | `#103B33` | deep pine-teal — primary text & dark sections |
| `healing` | `#1E6B5C` | mid teal — primary actions |
| `marigold` | `#E58A2E` | warm saffron accent — *hope*; used sparingly, esp. on Donate |
| `paper` | `#F6F4ED` | warm off-white background (not a pure cream cliché) |
| `rose` | `#C75D54` | care/alert highlight (rare) |
| `slate` | `#5B6B66` | muted captions |

Defined in `client/tailwind.config.js` and as `:root` variables in `client/src/index.css`.

## Typography (Google Fonts)

- **Display — Fraunces** (soft optical serif): headlines & big stat numerals. Warm, editorial,
  intentionally *not* Playfair/Times.
- **Body — Public Sans**: civic, highly legible — signals transparency/trust.
- **Data — Spline Sans Mono**: used *only* for financial/transparency figures (receipts, amounts,
  registration numbers) via the `.data` class — the monospace signals "real receipts".

Eyebrows are uppercase, letter-spaced **Public Sans** (the `.eyebrow` class), not mono.

## The signature element — the "lifeline"

`client/src/components/Lifeline.jsx`. A thin SVG EKG/heartbeat pulse that, looked at again, reads as
a **route connecting community dots** — tying HEALTH (the pulse) to HUMANITARIAN REACH (connected
villages). It is the one memorable thing; everything else stays quiet.

- **Hero:** draws in with a `stroke-dashoffset` animation, gradient-faded at both ends, pulsing dots.
- **Divider:** `LifelineDivider` — a static hairline recurring between sections.
- **Brand mark / favicon / admin / 404:** small static variants.
- **Reduced motion:** under `prefers-reduced-motion`, the draw animation and dot pulse are disabled
  (the line shows statically) — handled both via `motion-safe:` utilities and a global CSS override.

## Motion

Restrained: a hero page-load reveal (`animate-fade-up`), scroll-triggered impact counters
(`CountUp` + IntersectionObserver), and gentle hover lifts on cards. Nothing bouncy. All non-essential
motion is gated behind `motion-safe:` / the reduced-motion media query.

## Components

`.btn` variants (`btn-primary`, `btn-donate`, `btn-ghost`, `btn-dark`), `.card`, `.field-input` /
`.field-label` / `.field-error`, `.data`, `.eyebrow`, `.container-px`. Shadows: `card` and `lift`.

## Accessibility floor (non-negotiable)

- Responsive down to 360px.
- Visible keyboard focus rings everywhere (`:focus-visible` → marigold ring).
- Semantic HTML, skip-to-content link, ARIA where needed (`aria-invalid`, `role="alert"` on errors,
  `aria-pressed` on toggle chips, labelled fields).
- Alt text on all images.
- WCAG AA contrast (ink/healing on paper, paper on ink all pass AA).
- Forms have inline, programmatically-associated error messages.
