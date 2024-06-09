import type { PostPublicOauthResponseBody } from '@packages/shared';
import { defineStore } from 'pinia';
import { inject, ref } from 'vue';
import type { Router } from 'vue-router';

import { postRequest } from '#src/api/api.js';

export const useUserStore = defineStore(
  'user',
  () => {
    const isLoggedIn = ref(false);
    const gameUserId = ref(0);
    const router = inject<Router>('$router');
    const username = ref('');

    const login = async (code: string) => {
      const response = await postRequest<PostPublicOauthResponseBody>({
        endpoint: '/public/oauth',
        payload: { code },
      });

      username.value = response.data.name;
      gameUserId.value = response.data.gameUserId;
      isLoggedIn.value = true;

      await router?.push('/');
    };

    const logout = async () => {
      gameUserId.value = 0;
      isLoggedIn.value = false;
      username.value = '';

      /*
       * TODO: Implement this endpoint
       * await getRequest({ endpoint: '/public/logout' });
       */

      await router?.push('/login');
    };

    return { username, isLoggedIn, gameUserId, login, logout };
  },
  { persist: true },
);
