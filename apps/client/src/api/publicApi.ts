import type {
  GetPublicLogoutResponseBody,
  Nothing,
  PostPublicLoginRequestBody,
  PostPublicLoginResponseBody,
} from '@packages/shared';
import { getRequest, postRequest } from '@packages/shared';

import { baseUrl } from '#src/api/apiConstants.js';

/**
 * Log out the user and destroy its session.
 */
export const getPublicLogout = () => {
  return getRequest<Nothing, GetPublicLogoutResponseBody>({
    baseUrl,
    endpoint: '/public/logout',
    payload: {},
  });
};

/**
 * Exchange an authentication code from osu! Oauth for a user bearer token + init a session.
 */
export const postPublicLogin = (authenticationCode: string) => {
  return postRequest<PostPublicLoginRequestBody, PostPublicLoginResponseBody>({
    baseUrl,
    endpoint: '/public/login',
    payload: { code: authenticationCode },
  });
};
