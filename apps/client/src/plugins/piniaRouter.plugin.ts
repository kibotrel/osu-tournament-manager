import 'pinia';
import type { PiniaPluginContext } from 'pinia';
import { markRaw } from 'vue';
import type { Router } from 'vue-router';

import router from '#src/router/index.js';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $router: Router;
  }
}

export const PiniaRouterPlugin = (context: PiniaPluginContext) => {
  /* eslint-disable-next-line no-param-reassign */
  context.store.$router = markRaw(router);
};
