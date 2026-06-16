/**
 * Rate limiters for public write endpoints (forms, auth, payments).
 * Keeps casual abuse + spam bursts off the API. See /docs/architecture.md.
 */
import rateLimit from 'express-rate-limit';
import { env } from '../lib/env.js';

const skip = () => env.isTest; // don't throttle inside the test suite

// Generous: page-level public POSTs (volunteer / contact)
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { error: { message: 'Too many submissions. Please try again in a little while.' } },
});

// Tighter: auth login attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { error: { message: 'Too many login attempts. Please wait and try again.' } },
});

// Payment order creation
export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip,
  message: { error: { message: 'Too many payment attempts. Please try again shortly.' } },
});
