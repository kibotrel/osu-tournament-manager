import internationalization from 'i18next';

import en from '#src/locales/en.json';
import fr from '#src/locales/fr.json';

export const defaultNamespace = 'translation';
export type DefaultNamespace = typeof defaultNamespace;

export const namespaces = ['translation'] as const;
export type Namespace = (typeof namespaces)[number];

export const supportedLanguages = ['en', 'fr'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

export const resources: Record<
  SupportedLanguage,
  Record<Namespace, Record<string, unknown>>
> = {
  en: { translation: en },
  fr: { translation: fr },
} as const;

internationalization.init({
  debug: import.meta.env.DEV,
  fallbackLng: false,
  interpolation: { escapeValue: false },
  lng: 'en',
  load: 'currentOnly',
  resources,
});

export { default as InternationalizationPlugin } from 'i18next';
