/**
 * Zero-setup local dev server.
 * Boots an in-memory MongoDB, seeds it, then starts the Express API — so you
 * can run the whole app with no Docker, no Atlas, no local Mongo install.
 *
 *   npm run dev:mem        (from /server, or `npm run dev:mem` at the root)
 *
 * Data lives only in memory and resets on restart. For a persistent DB, set
 * MONGODB_URI in server/.env and use `npm run dev` instead.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';

// Provide sane dev defaults BEFORE anything imports lib/env.js.
const mongo = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongo.getUri('aarogya');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret';

const { connectDB } = await import('./src/lib/db.js');
const { seedDatabase } = await import('./src/seed.js');
const { createApp } = await import('./src/app.js');
const { env } = await import('./src/lib/env.js');

await connectDB();
await seedDatabase();

const app = createApp();
app.listen(env.port, () => {
  console.log('\n────────────────────────────────────────────────');
  console.log(`  Aarogya API (in-memory DB) → http://localhost:${env.port}`);
  console.log('  Seeded admin: admin@aarogyafoundation.org / Admin@12345');
  console.log('────────────────────────────────────────────────\n');
});

const shutdown = async () => {
  await mongo.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
