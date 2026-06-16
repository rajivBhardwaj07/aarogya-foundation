/** Auth routes: login / logout / me. */
import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { requireAuth } from '../middleware/auth.js';
import { loginSchema } from '../validators/index.js';

export const authRouter = Router();

authRouter.post('/login', authLimiter, validate(loginSchema), login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, me);
