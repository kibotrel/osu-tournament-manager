import 'pinia';
import type { PiniaPluginContext } from 'pinia';
import type { App } from 'vue';
import { markRaw } from 'vue';
import type { Router } from 'vue-router';

import router from '#src/router/index.js';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

export const vuePluginRouter = {
  install: (app: App) => {
    app.provide('$router', router);
  },
};

export const piniaPluginRouter = (context: PiniaPluginContext) => {
  /* eslint-disable-next-line no-param-reassign */
  context.store.$router = markRaw(router);
};
