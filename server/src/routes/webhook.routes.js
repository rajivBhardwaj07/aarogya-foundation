/** Razorpay webhook route. Raw body is captured in app.js for signature checks. */
import { Router } from 'express';
import { razorpayWebhook } from '../controllers/webhook.controller.js';

export const webhookRouter = Router();

webhookRouter.post('/razorpay', razorpayWebhook);
