/**
 * Auth: login (sets httpOnly cookie), logout (clears it), me (current user).
 * See /docs/architecture.md — "Auth model".
 */
import { asyncHandler, ApiError } from '../lib/ApiError.js';
import { User } from '../models/User.js';
import { signToken, cookieOptions, COOKIE_NAME } from '../middleware/auth.js';

/** POST /api/auth/login */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  // Same response whether email or password is wrong (no account enumeration).
  if (!user || !(await user.verifyPassword(password))) {
    throw ApiError.unauthorized('Email or password is incorrect.');
  }
  res.cookie(COOKIE_NAME, signToken(user), cookieOptions());
  res.json({ user: user.toSafeJSON() });
});

/** POST /api/auth/logout */
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

/** GET /api/auth/me */
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});
