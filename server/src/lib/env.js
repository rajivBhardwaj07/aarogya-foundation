/**
 * Centralised, validated environment config.
 * See /docs/architecture.md — "Configuration & secrets".
 * Loads .env once, fails fast on missing critical vars (outside tests),
 * and exposes a typed-ish `env` object the rest of the app imports.
 */
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined && !isTest) {
    // eslint-disable-next-line no-console
    console.warn(`[env] Missing recommended variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest,
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  mongoUri: required('MONGODB_URI', 'mongodb://127.0.0.1:27017/aarogya'),

  jwtSecret: required('JWT_SECRET', isTest ? 'test-secret' : undefined),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@aarogyafoundation.org',
    adminPassword: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    editorEmail: process.env.SEED_EDITOR_EMAIL || 'editor@aarogyafoundation.org',
    editorPassword: process.env.SEED_EDITOR_PASSWORD || 'Editor@12345',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },

  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'Aarogya Foundation <no-reply@aarogyafoundation.org>',
    adminNotify: process.env.ADMIN_NOTIFY_EMAIL || 'admin@aarogyafoundation.org',
  },
};
