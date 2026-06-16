/** Donation routes: create order + verify payment. */
import { Router } from 'express';
import { createOrder, verifyPayment } from '../controllers/donation.controller.js';
import { validate } from '../middleware/validate.js';
import { paymentLimiter } from '../middleware/rateLimit.js';
import { donationOrderSchema, donationVerifySchema } from '../validators/index.js';

export const donationRouter = Router();

donationRouter.post('/order', paymentLimiter, validate(donationOrderSchema), createOrder);
donationRouter.post('/verify', validate(donationVerifySchema), verifyPayment);
