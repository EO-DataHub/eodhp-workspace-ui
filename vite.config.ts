/// <reference types="vitest" />
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    allowOnly: true,
    setupFiles: [path.resolve(__dirname, './vitest.setup.ts')],
    include: ['**/*.test.{ts,tsx}'],
  },
});
