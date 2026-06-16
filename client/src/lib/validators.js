/**
 * Client-side Zod schemas — MIRROR of /server/src/validators/index.js.
 * Keeping the same rules in both places means the user gets instant inline
 * feedback (react-hook-form) AND the server independently re-validates every
 * request (never trust the client). See /docs/INTERVIEW-NOTES.md.
 */
import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Enter a valid email address.');
const name = z.string().trim().min(2, 'Please enter your full name.').max(120);
const pan = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid 10-character PAN.');

export const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

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

export const AVAILABILITY = [
  'Weekends',
  'Weekdays',
  'A few hours a week',
  'Full-time',
  'On-call for camps',
];

export const donationFormSchema = z.object({
  donorName: name,
  email,
  pan: pan.optional().or(z.literal('')),
  amountInRupees: z.coerce
    .number({ invalid_type_error: 'Enter an amount.' })
    .int('Enter a whole rupee amount.')
    .min(100, 'Minimum donation is ₹100.')
    .max(1_000_000, 'For gifts above ₹10,00,000 please contact us directly.'),
  frequency: z.enum(['ONE_TIME', 'MONTHLY']),
  coverFee: z.boolean().default(false),
});

export const volunteerFormSchema = z.object({
  name,
  email,
  phone: z.string().trim().regex(/^[0-9+\-\s]{7,15}$/, 'Enter a valid phone number.'),
  city: z.string().trim().min(2, 'Which city are you in?').max(80),
  skills: z.array(z.string()).min(1, 'Pick at least one way you can help.'),
  availability: z.enum(AVAILABILITY),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
});

export const contactFormSchema = z.object({
  name,
  email,
  subject: z.string().trim().min(3, 'Add a short subject.').max(150),
  body: z.string().trim().min(10, 'Tell us a little more.').max(2000),
  website: z.string().max(0).optional().or(z.literal('')), // honeypot
});

export const loginFormSchema = z.object({
  email,
  password: z.string().min(6, 'Password is required.'),
});
