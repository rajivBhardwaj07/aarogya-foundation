/**
 * Central error-handling middleware + 404 handler.
 * Produces a consistent JSON error envelope and never leaks stack traces
 * to clients in production. See /docs/architecture.md — "Error handling".
 */
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { ApiError } from '../lib/ApiError.js';
import { env } from '../lib/env.js';

export function notFound(req, res) {
  res.status(404).json({
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
}

// eslint-disable-next-line no-unused-vars -- Express needs the 4-arg signature
export function errorHandler(err, req, res, next) {
  let status = 500;
  let message = 'Something went wrong on our side. Please try again.';
  let details;

  if (err instanceof ZodError) {
    status = 400;
    message = 'Some fields need your attention.';
    details = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  } else if (err instanceof ApiError) {
    status = err.status;
    message = err.message;
    details = err.details;
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Some fields need your attention.';
    details = Object.values(err.errors).map((e) => ({ path: e.path, message: e.message }));
  } else if (err?.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    message = `That ${field} is already in use.`;
  } else if (err?.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body.';
  }

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  const body = { error: { message } };
  if (details) body.error.details = details;
  if (!env.isProd && status >= 500) body.error.stack = err.stack;

  res.status(status).json(body);
}
