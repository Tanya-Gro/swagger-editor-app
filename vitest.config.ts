import { defineConfig } from 'vitest/config';
import path from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@messages': path.resolve(import.meta.dirname, './messages'),
    },
  },
  test: {
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['@mui/material', 'react-transition-group'],
      },
    },
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      exclude: ['**/*.css', '**/*types.ts'],
      thresholds: {
        global: {
          statements: 80,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
