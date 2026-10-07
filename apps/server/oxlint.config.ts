import { defineConfig } from 'oxlint';

import { nodeConfiguration } from '@packages/config-linter';

export default defineConfig({
  extends: [nodeConfiguration],
  ignorePatterns: ['migrations/**'],
  rules: { 'vitest/require-mock-type-parameters': 'off' },
});
