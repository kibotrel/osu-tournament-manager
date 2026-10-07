import { defineConfig } from 'oxfmt';

import { nodeConfiguration } from '@packages/config-formatter';

export default defineConfig({
  ...nodeConfiguration,
  sortTailwindcss: { stylesheet: './src/assets/styles/index.css' },
});
