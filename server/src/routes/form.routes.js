/** Public form routes: volunteer + contact (rate-limited, Zod-validated). */
import { Router } from 'express';
import { createVolunteer, createContact } from '../controllers/form.controller.js';
import { validate } from '../middleware/validate.js';
import { formLimiter } from '../middleware/rateLimit.js';
import { volunteerSchema, contactSchema } from '../validators/index.js';

export const formRouter = Router();

formRouter.post('/volunteers', formLimiter, validate(volunteerSchema), createVolunteer);
formRouter.post('/contact', formLimiter, validate(contactSchema), createContact);
