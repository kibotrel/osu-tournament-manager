import type { OxlintConfig } from 'oxlint';

export const nodeConfiguration: OxlintConfig = {
  categories: { correctness: 'error', suspicious: 'warn' },
  env: { es6: true },
  options: {},
  overrides: [{ files: ['ox{fmt,lint}.config.ts'], rules: { 'import/no-default-export': 'off' } }],
  plugins: ['eslint', 'import', 'promise', 'typescript', 'unicorn', 'vitest'],
};
