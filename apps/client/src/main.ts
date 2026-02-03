import { VueQueryPlugin } from '@tanstack/vue-query';
import InternationalizationVuePlugin from 'i18next-vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import '@fontsource/geist-sans/100.css';
import '@fontsource/geist-sans/200.css';
import '@fontsource/geist-sans/300.css';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource/geist-sans/800.css';
import '@fontsource/geist-sans/900.css';

import App from '#src/app.vue';
import '#src/assets/styles/index.css';
import router from '#src/router/index.js';

import { InternationalizationPlugin } from './plugins/internationalizationPlugin.js';
import { PiniaRouterPlugin } from './plugins/piniaRouterPlugin.js';
import { VueRouterPlugin } from './plugins/vueRouterPlugin.js';

const app = createApp(App);
const pinia = createPinia();

app.use(InternationalizationVuePlugin, { i18next: InternationalizationPlugin });
app.use(pinia);
app.use(router);
app.use(VueRouterPlugin);
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
  queryClientConfig: {
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  },
});
pinia.use(PiniaRouterPlugin);
pinia.use(createPersistedState());

app.mount('#app');
