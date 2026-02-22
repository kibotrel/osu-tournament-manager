import type {
  LoginRequestBody,
  LoginResponseBody,
  LoginResponseData,
  LogoutRequestBody,
  LogoutResponseBody,
} from '@packages/shared';
import { getRequest, postRequest } from '@packages/shared';
import { useMutation } from '@tanstack/vue-query';
import { inject } from 'vue';
import type { Router } from 'vue-router';

import { BASE_URL } from '#src/api/api.constants.js';
import { useUserStore } from '#src/stores/user.store.js';

const loginRequest = async (authenticationCode: string) => {
  const response = await postRequest<LoginRequestBody, LoginResponseBody>({
    baseUrl: BASE_URL,
    endpoint: '/authentication/login',
    payload: { authenticationCode },
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as LoginResponseData;
};

const logoutRequest = async () => {
  const response = await getRequest<LogoutRequestBody, LogoutResponseBody>({
    baseUrl: BASE_URL,
    endpoint: '/authentication/logout',
    payload: {},
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data;
};

/**
 * Exchange an authentication code from osu! Oauth for a user bearer token + init a session.
 */
export const useLoginRequest = () => {
  const router = inject<Router>('$router');

  return useMutation<LoginResponseData, Error, string>({
    mutationFn: async (code) => {
      return await loginRequest(code);
    },
    onSuccess: async (data) => {
      // TODO: Add a toast message here
      const { setUser } = useUserStore();

      setUser({ ...data, isLoggedIn: true });
      await router?.push('/');
    },
    onError: async () => {
      // TODO: Add a toast message here
      await router?.push('/login');
    },
  });
};

/**
 * Log out the user and destroy its session.
 */
export const useLogoutRequest = () => {
  const router = inject<Router>('$router');

  return useMutation<LogoutResponseBody, Error>({
    mutationFn: async () => {
      return await logoutRequest();
    },
    onSettled: async () => {
      const { resetUser } = useUserStore();

      resetUser();
      await router?.push('/login');
    },
  });
};
