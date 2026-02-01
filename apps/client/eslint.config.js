import pluginQuery from '@tanstack/eslint-plugin-query';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

import rootConfig from '../../eslint.config.js';

export default [
  ...rootConfig,
  ...pluginVue.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
  skipFormatting,
  { languageOptions: { globals: { ...globals.browser } } },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
  },
  { ignores: ['dist/', 'coverage/', 'eslint.config.js'] },
];
