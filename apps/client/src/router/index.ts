import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => {
        return import('#src/components/homePage.vue');
      },
    },
  ],
});

export default router;
