import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import App from './app.vue';
import './assets/styles/index.css';
import { piniaPluginRouter, vuePluginRouter } from './plugins/index.js';
import router from './router/index.js';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuePluginRouter);
pinia.use(piniaPluginRouter);
pinia.use(createPersistedState());

app.mount('#app');
