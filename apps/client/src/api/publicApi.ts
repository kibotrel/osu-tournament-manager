import type {
  GetPublicLogoutRequestBody,
  GetPublicLogoutResponseBody,
  PostPublicLoginRequestBody,
  PostPublicLoginResponseBody,
  PostPublicLoginResponseData,
} from '@packages/shared';
import { getRequest, postRequest } from '@packages/shared';
import { useMutation } from '@tanstack/vue-query';
import { inject } from 'vue';
import type { Router } from 'vue-router';

import { baseUrl } from '#src/api/apiConstants.js';
import { useUserStore } from '#src/stores/userStore.js';

const postPublicLogin = async (authenticationCode: string) => {
  const response = await postRequest<
    PostPublicLoginRequestBody,
    PostPublicLoginResponseBody
  >({
    baseUrl,
    endpoint: '/public/login',
    payload: { authenticationCode },
  });

  if (!response.isOk) {
    throw new Error(JSON.stringify(response.data));
  }

  return response.data as PostPublicLoginResponseData;
};

const getPublicLogout = async () => {
  const response = await getRequest<
    GetPublicLogoutRequestBody,
    GetPublicLogoutResponseBody
  >({
    baseUrl,
    endpoint: '/public/logout',
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
export const usePostPublicLogin = () => {
  const router = inject<Router>('$router');

  return useMutation<PostPublicLoginResponseData, Error, string>({
    mutationFn: async (code) => {
      return await postPublicLogin(code);
    },
    onSuccess: async (data) => {
      const { setUser } = useUserStore();

      setUser({ ...data, isLoggedIn: true });
      await router?.push('/');
    },
    onError: async () => {
      await router?.push('/login');
    },
  });
};

/**
 * Log out the user and destroy its session.
 */
export const usePostPublicLogout = () => {
  const router = inject<Router>('$router');

  return useMutation<GetPublicLogoutResponseBody, Error>({
    mutationFn: async () => {
      return await getPublicLogout();
    },
    onSuccess: async () => {
      const { resetUser } = useUserStore();

      resetUser();
      await router?.push('/login');
    },
  });
};
