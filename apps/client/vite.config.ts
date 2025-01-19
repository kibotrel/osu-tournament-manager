import path from 'node:path';
import { URL, fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  preview: {
    host: '192.168.1.100',
    port: 8080,
    strictPort: true,
  },
  resolve: {
    alias: {
      '#src': path.resolve(fileURLToPath(new URL('src/', import.meta.url))),
    },
  },

  server: {
    hmr: {
      clientPort: 443,
      host: 'dev.osu-tournament-manager.app',
      protocol: 'wss',
    },
    host: '0.0.0.0',
    port: 8080,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['!**/node_modules/@packages/**'],
    },
  },
});
