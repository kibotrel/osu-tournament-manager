import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => {
        return import('#src/pages/dashboardPage.vue');
      },
    },
    {
      path: '/design-system',
      name: 'Design System',
      component: () => {
        return import('#src/pages/designSystemPage.vue');
      },
    },
    {
      path: '/oauth/callback',
      name: 'OauthCallback',
      component: () => {
        return import('#src/pages/oauthCallbackPage.vue');
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => {
        return import('#src/pages/loginPage.vue');
      },
    },
  ],
});

export default router;
