/* eslint-disable unicorn/filename-case */
/* eslint-disable unicorn/prevent-abbreviations */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_OSU_APPLICATION_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
