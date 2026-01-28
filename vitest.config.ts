import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'apps/*/vitest.config.{integration,unit}.ts',
      'packages/*/vitest.config.{integration,unit}.ts',
    ],
  },
});
