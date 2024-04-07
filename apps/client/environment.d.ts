/// <reference types="vite/client" />

import 'pinia';
import type { Router } from 'vue-router';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

interface ImportMetaEnvironment {}

interface ImportMeta {}
