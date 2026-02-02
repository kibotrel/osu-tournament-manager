import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => {
        return import('#src/pages/dashboardPage.vue');
      },
    },
    {
      path: '/matches/create',
      name: 'match-creation',
      component: () => {
        return import('#src/pages/matches/create/createMatchPage.vue');
      },
    },
    {
      path: String.raw`/matches/:gameMatchId(\d+)`,
      name: 'match',
      component: () => {
        return import('#src/pages/matches/matchPage.vue');
      },
    },
    {
      path: '/design-system',
      name: 'design-system',
      component: () => {
        return import('#src/pages/designSystem/designSystemPage.vue');
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => {
        return import('#src/pages/loginPage.vue');
      },
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: () => {
        return import('#src/pages/oauthCallbackPage.vue');
      },
    },
  ],
});

export default router;
