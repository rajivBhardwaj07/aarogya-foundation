/**
 * JWT auth + role-based access control.
 * The token lives in an httpOnly cookie (`token`) — not localStorage — so it
 * is not reachable from JS (XSS-resistant). See /docs/INTERVIEW-NOTES.md.
 */
import jwt from 'jsonwebtoken';
import { env } from '../lib/env.js';
import { ApiError } from '../lib/ApiError.js';
import { User } from '../models/User.js';

export const COOKIE_NAME = 'token';

export function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd, // HTTPS-only in prod
    sameSite: env.isProd ? 'none' : 'lax', // cross-site (Vercel↔Render) in prod
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

export async function requireAuth(req, _res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) throw ApiError.unauthorized();
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) throw ApiError.unauthorized('Your session is no longer valid.');
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    return next(ApiError.unauthorized('Your session has expired. Please sign in again.'));
  }
}

/** Restrict a route to specific roles. ADMIN implicitly passes editor gates. */
export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized());
  if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
  next();
};
