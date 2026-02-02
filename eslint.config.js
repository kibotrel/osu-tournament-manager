import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import comments from 'eslint-plugin-eslint-comments';
import importX from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import preferArrow from 'eslint-plugin-prefer-arrow';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import promise from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import tsdoc from 'eslint-plugin-tsdoc';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default defineConfig(
  {
    ignores: [
      '**/coverage/',
      '**/dist/',
      '**/node_modules/',
      '**/prettier.config.js',
      'commitlint.config.js',
      'pnpm-lock.yaml',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  unicorn.configs.recommended,
  prettierRecommended,
  sonarjs.configs.recommended,
  jsdoc.configs['flat/recommended'],
  promise.configs['flat/recommended'],
  importX.configs['flat/recommended'],
  importX.configs.typescript,

  {
    plugins: {
      vitest,
      tsdoc,
      'prefer-arrow': preferArrow,
      'import-x': importX,
      'eslint-comments': comments,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
      parserOptions: { project: true, tsconfigRootDir: dirname },
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [
            'tsconfig.json',
            'apps/*/tsconfig.json',
            'packages/*/tsconfig.json',
          ],
        },
        node: true,
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'error',

      'arrow-body-style': ['error', 'always'],
      camelcase: 'off',
      curly: 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'eslint-comments/disable-enable-pair': ['warn', { allowWholeFile: true }],
      'eslint-comments/no-aggregating-enable': 'error',
      'eslint-comments/no-duplicate-disable': 'error',
      'eslint-comments/no-unlimited-disable': 'error',
      'eslint-comments/no-unused-disable': 'error',
      'eslint-comments/no-unused-enable': 'error',
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-amd': 'error',
      'import-x/no-commonjs': 'error',
      'import-x/no-deprecated': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          packageDir: [
            dirname,
            path.join(dirname, 'apps/client'),
            path.join(dirname, 'apps/server'),
            path.join(dirname, 'packages/api-specification'),
            path.join(dirname, 'packages/bancho-client'),
            path.join(dirname, 'packages/logger'),
            path.join(dirname, 'packages/osu-sdk'),
            path.join(dirname, 'packages/shared'),
          ],
        },
      ],
      'import-x/no-mutable-exports': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-unresolved': 'error',
      'import-x/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          'newlines-between': 'always',
          pathGroups: [{ pattern: '#*/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import-x/prefer-default-export': 'off',

      'jsdoc/require-param': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-type': 'off',

      'line-comment-position': ['error', { position: 'above' }],
      'max-depth': ['error', 3],
      'multiline-comment-style': 'off',

      'no-alert': 'error',
      'no-caller': 'error',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-empty-function': 'error',
      'no-empty-static-block': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-label': 'error',
      'no-implicit-coercion': 'error',
      'no-implied-eval': 'error',
      'no-inline-comments': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-mixed-operators': 'off',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': ['error', { props: true }],
      'no-proto': 'error',
      'no-script-url': 'error',
      'no-sequences': 'error',
      'no-return-assign': 'error',
      'no-return-await': 'off',
      'no-throw-literal': 'error',
      'no-underscore-dangle': 'error',
      'no-unneeded-ternary': 'error',
      'no-useless-computed-key': 'error',
      'no-var': 'error',

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['break', 'continue', 'return', 'block-like'],
        },
        {
          blankLine: 'never',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: ['block-like', 'expression'],
        },
        {
          blankLine: 'always',
          prev: ['block-like', 'expression'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: 'block-like', next: '*' },
      ],

      'prefer-arrow-callback': 'error',
      'prefer-arrow/prefer-arrow-functions': [
        'error',
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
      'prefer-const': 'error',
      'prefer-destructuring': [
        'warn',
        {
          AssignmentExpression: { array: true, object: false },
          VariableDeclarator: { array: false, object: true },
        },
        { enforceForRenamedProperties: false },
      ],
      'prefer-promise-reject-errors': ['error', { allowEmptyReject: false }],
      'prefer-template': 'error',
      'require-await': 'error',

      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/no-control-regex': 'off',
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-identical-functions': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
      'sonarjs/todo-tag': 'off',
      'sort-imports': [
        'warn',
        {
          allowSeparatedGroups: false,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
        },
      ],

      'tsdoc/syntax': 'warn',

      'unicorn/filename-case': ['error', { case: 'camelCase' }],
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-object-as-default-parameter': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-unreadable-array-destructuring': 'off',
      'unicorn/number-literal-case': 'off',
      'unicorn/prefer-event-target': 'off',
      'unicorn/prefer-logical-operator-over-ternary': 'off',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prevent-abbreviations': [
        'warn',
        { allowList: { params: true } },
      ],

      yoda: 'error',
    },
  },
  { ignores: ['eslint.config.js'] },
);
