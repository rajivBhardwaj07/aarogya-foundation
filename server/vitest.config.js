import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret',
      RAZORPAY_KEY_ID: 'rzp_test_key',
      RAZORPAY_KEY_SECRET: 'testsecret',
      RAZORPAY_WEBHOOK_SECRET: 'webhooksecret',
    },
    // mongodb-memory-server can take a moment to download/start on first run.
    // Run test files sequentially so only one in-memory mongod starts at a time
    // (parallel starts on Windows can exceed the instance start timeout).
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});
