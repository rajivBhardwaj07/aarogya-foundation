import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxies /api → Express so the client can use same-origin cookies
// in development. In production VITE_API_URL points at the deployed API.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    exclude: ['**/node_modules/**', '**/e2e/**'],
  },
});
