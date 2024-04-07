import router from '#src/router/index.js';

import type { PiniaPluginContext } from 'pinia';
import { markRaw, type App } from 'vue';

export const vuePluginRouter = {
  install: (app: App) => {
    app.provide('$router', router);
  },
};

export const piniaPluginRouter = (context: PiniaPluginContext) => {
  context.store.$router = markRaw(router);
};
