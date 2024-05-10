import type { PiniaPluginContext } from 'pinia';
import type { App } from 'vue';
import { markRaw } from 'vue';

import router from '#src/router/index.js';

export const vuePluginRouter = {
  install: (app: App) => {
    app.provide('$router', router);
  },
};

export const piniaPluginRouter = (context: PiniaPluginContext) => {
  /* eslint-disable-next-line no-param-reassign */
  context.store.$router = markRaw(router);
};
