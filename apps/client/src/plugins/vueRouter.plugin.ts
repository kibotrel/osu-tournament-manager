import 'pinia';
import type { App } from 'vue';

import router from '#src/router/index.js';

export const VueRouterPlugin = {
  install: (app: App) => {
    app.provide('$router', router);
  },
};
