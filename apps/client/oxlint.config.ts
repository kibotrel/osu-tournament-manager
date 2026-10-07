import { defineConfig } from 'oxlint';

import { nodeConfiguration } from '@packages/config-linter';

export default defineConfig({ extends: [nodeConfiguration], plugins: ['vue'] });
