import { isErrorReport } from '@packages/shared';
import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
import type { Router } from 'vue-router';

import { getPublicLogout, postPublicLogin } from '#src/api/publicApi.js';

export const useUserStore = defineStore(
  'user',
  () => {
    const gameUserId = ref(0);
    const isLoggedIn = ref(false);
    const router = inject<Router>('$router');
    const username = ref('');

    const login = async (code: string) => {
      const response = await postPublicLogin(code);

      if (isErrorReport(response.data)) {
        return router?.push('/login');
      }

      gameUserId.value = response.data.gameUserId;
      isLoggedIn.value = true;
      username.value = response.data.name;

      await router?.push('/');
    };

    const logout = async () => {
      gameUserId.value = 0;
      isLoggedIn.value = false;
      username.value = '';

      await getPublicLogout();

      await router?.push('/login');
    };

    return { gameUserId, isLoggedIn, login, logout, username };
  },
  { persist: true },
);
