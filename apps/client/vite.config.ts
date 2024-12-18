import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  preview: {
    port: 8080,
    host: '192.168.1.100',
    strictPort: true,
  },
  resolve: {
    alias: {
      '#src': path.resolve(fileURLToPath(new URL('src/', import.meta.url))),
    },
  },

  server: {
    port: 8080,
    host: 'localhost',
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['!**/node_modules/@packages/**'],
    },
  },
});
