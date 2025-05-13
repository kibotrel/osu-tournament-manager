import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/*/vitest.config.{integration,unit}.ts',
  'packages/*/vitest.config.{integration,unit}.ts',
]);
