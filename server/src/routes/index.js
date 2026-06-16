/**
 * Top-level /api router. Mounts feature routers.
 * Kept thin: each feature owns its own router file.
 */
import { Router } from 'express';
import mongoose from 'mongoose';
import { publicRouter } from './public.routes.js';
import { donationRouter } from './donation.routes.js';
import { webhookRouter } from './webhook.routes.js';
import { formRouter } from './form.routes.js';
import { authRouter } from './auth.routes.js';
import { adminRouter } from './admin.routes.js';

export const router = Router();

router.get('/health', (_req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    service: 'aarogya-api',
    db: states[mongoose.connection.readyState] ?? 'unknown',
    time: new Date().toISOString(),
  });
});

router.use('/', publicRouter);
router.use('/donations', donationRouter);
router.use('/webhooks', webhookRouter);
router.use('/', formRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
