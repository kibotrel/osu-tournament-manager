import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => {
        return import('#src/pages/dashboard.page.vue');
      },
    },
    {
      path: '/matches/create',
      name: 'match-creation',
      component: () => {
        return import('#src/pages/matches/create/matches.create.page.vue');
      },
    },
    {
      path: String.raw`/matches/:gameMatchId(\d+)`,
      name: 'match',
      component: () => {
        return import('#src/pages/matches/match.page.vue');
      },
    },
    {
      path: '/design-system',
      name: 'design-system',
      component: () => {
        return import('#src/pages/designSystem/designSystem.page.vue');
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => {
        return import('#src/pages/login.page.vue');
      },
    },
    {
      path: '/oauth/callback',
      name: 'oauth-callback',
      component: () => {
        return import('#src/pages/oauthCallback.page.vue');
      },
    },
  ],
});

export default router;
