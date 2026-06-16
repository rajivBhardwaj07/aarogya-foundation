/**
 * Express application factory.
 * Wires security middleware, body parsing (with raw-body capture for the
 * Razorpay webhook), the /api router, and the central error handler.
 * Exported separately from the HTTP listener so tests can import the app.
 * See /docs/architecture.md — "Request flow".
 */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './lib/env.js';
import { router as apiRouter } from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1); // correct client IPs behind Render/Vercel proxies

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );

  // Capture the raw body so the webhook controller can verify the HMAC
  // signature against the exact bytes Razorpay signed.
  app.use(
    express.json({
      limit: '1mb',
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (!env.isTest) app.use(morgan(env.isProd ? 'combined' : 'dev'));

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
