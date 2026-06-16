/**
 * HTTP entry point. Connects to MongoDB, then starts the Express server.
 * `npm run dev` (node --watch) or `npm start`.
 */
import { createApp } from './app.js';
import { connectDB } from './lib/db.js';
import { env } from './lib/env.js';

async function main() {
  await connectDB();
  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Aarogya API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[server] failed to start:', err);
  process.exit(1);
});
