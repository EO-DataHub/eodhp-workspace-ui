/// <reference types="vitest" />
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/static-apps/workspace-ui/main/', // TODO: This will only retrieve the asset from the main branch
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Preserve hashing for all assets except index.css & index.js
          if (assetInfo.name?.startsWith('index')) {
            return 'assets/index.[ext]'; // Remove hash for index files
          }
          return 'assets/[name]-[hash].[ext]'; // Keep hash for other assets
        },
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: (chunkInfo) => {
          // Preserve hashing for all entry files except index.js
          return chunkInfo.name === 'index' ? 'assets/index.js' : 'assets/[name]-[hash].js';
        },
      },
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
