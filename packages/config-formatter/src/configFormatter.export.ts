import type { OxfmtConfig } from 'oxfmt';

export const nodeConfiguration: OxfmtConfig = {
  objectWrap: 'collapse',
  singleQuote: true,
  sortImports: {
    ignoreCase: true,
    internalPattern: ['@packages/'],
    groups: [
      'builtin',
      'external',
      'internal',
      'subpath',
      ['parent', 'sibling', 'index'],
      'style',
      'unknown',
    ],
  },
};
