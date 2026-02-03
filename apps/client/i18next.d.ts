import type {
  DefaultNamespace,
  resources,
} from './src/plugins/internationalizationPlugin';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: DefaultNamespace;
    resources: (typeof resources)['en'];
  }
}
