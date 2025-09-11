import { VueQueryPlugin } from '@tanstack/vue-query';
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
import { piniaPluginRouter, vuePluginRouter } from '#src/plugins/index.js';
import router from '#src/router/index.js';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuePluginRouter);
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
  queryClientConfig: {
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  },
});
pinia.use(piniaPluginRouter);
pinia.use(createPersistedState());

app.mount('#app');
