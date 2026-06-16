/**
 * Shared Zod schemas — the single source of truth for input validation.
 * Used by the server (validate middleware) and mirrored on the client
 * (client/src/lib/validators.js) so the same rules run in both places.
 * See /docs/architecture.md — "Shared validation".
 */
import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Enter a valid email address.');
const name = z.string().trim().min(2, 'Please enter your full name.').max(120);

// Indian PAN: 5 letters, 4 digits, 1 letter. Optional for donations.
const pan = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid 10-character PAN.');

// ── Donations ────────────────────────────────────────────────
export const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export const donationOrderSchema = z.object({
  donorName: name,
  email,
  pan: pan.optional().or(z.literal('')).transform((v) => (v ? v : undefined)),
  amountInRupees: z.coerce
    .number({ invalid_type_error: 'Enter an amount.' })
    .int('Enter a whole rupee amount.')
    .min(100, 'Minimum donation is ₹100.')
    .max(1_000_000, 'For gifts above ₹10,00,000 please contact us directly.'),
  frequency: z.enum(['ONE_TIME', 'MONTHLY']).default('ONE_TIME'),
  coverFee: z.coerce.boolean().default(false),
});

export const donationVerifySchema = z.object({
  razorpay_order_id: z.string().min(4),
  razorpay_payment_id: z.string().min(4),
  razorpay_signature: z.string().min(8),
});

// ── Volunteer ────────────────────────────────────────────────
export const VOLUNTEER_SKILLS = [
  'Medical / Nursing',
  'Pharmacy',
  'Community Mobilisation',
  'Teaching / Awareness',
  'Logistics & Supplies',
  'Fundraising',
  'Photography / Media',
  'Data & Tech',
];

export const AVAILABILITY = ['Weekends', 'Weekdays', 'A few hours a week', 'Full-time', 'On-call for camps'];

export const volunteerSchema = z.object({
  name,
  email,
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, 'Enter a valid phone number.'),
  city: z.string().trim().min(2, 'Which city are you in?').max(80),
  skills: z.array(z.string()).min(1, 'Pick at least one way you can help.'),
  availability: z.enum(AVAILABILITY),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  // Honeypot: must stay empty. Bots fill it; humans never see it.
  website: z.string().max(0, 'Spam detected.').optional().or(z.literal('')),
});

// ── Contact ──────────────────────────────────────────────────
export const contactSchema = z.object({
  name,
  email,
  subject: z.string().trim().min(3, 'Add a short subject.').max(150),
  body: z.string().trim().min(10, 'Tell us a little more.').max(2000),
  website: z.string().max(0, 'Spam detected.').optional().or(z.literal('')),
});

// ── Auth ─────────────────────────────────────────────────────
export const loginSchema = z.object({
  email,
  password: z.string().min(6, 'Password is required.'),
});

// ── Admin: content ───────────────────────────────────────────
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can contain lowercase letters, numbers and hyphens.');

export const postSchema = z.object({
  type: z.enum(['NEWS', 'BLOG']).default('BLOG'),
  title: z.string().trim().min(4).max(200),
  slug,
  excerpt: z.string().trim().min(10).max(300),
  body: z.string().trim().min(20),
  coverImage: z.string().url().optional().or(z.literal('')),
  category: z.string().trim().min(2).max(60),
  author: z.string().trim().min(2).max(80),
  published: z.coerce.boolean().default(false),
});

export const eventSchema = z.object({
  title: z.string().trim().min(4).max(200),
  slug,
  description: z.string().trim().min(20),
  startsAt: z.coerce.date(),
  location: z.string().trim().min(2).max(160),
  type: z.enum(['UPCOMING', 'PAST']).default('UPCOMING'),
  coverImage: z.string().url().optional().or(z.literal('')),
  published: z.coerce.boolean().default(true),
});

export const impactStatSchema = z.object({
  key: slug,
  label: z.string().trim().min(2).max(80),
  value: z.coerce.number().min(0),
  suffix: z.string().max(4).optional().or(z.literal('')),
  order: z.coerce.number().int().default(0),
});

export const transparencySchema = z
  .object({
    year: z.coerce.number().int().min(2000).max(2100),
    programPct: z.coerce.number().min(0).max(100),
    adminPct: z.coerce.number().min(0).max(100),
    fundraisingPct: z.coerce.number().min(0).max(100),
    totalRaisedInPaise: z.coerce.number().min(0).default(0),
    reportUrl: z.string().url().optional().or(z.literal('')),
  })
  .refine((d) => d.programPct + d.adminPct + d.fundraisingPct === 100, {
    message: 'Programme, admin and fundraising percentages must add up to 100.',
    path: ['programPct'],
  });
