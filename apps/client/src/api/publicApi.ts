import type {
  GetPublicLogoutResponseBody,
  PostPublicOauthResponseBody,
} from '@packages/shared';
import { getRequest, postRequest } from '@packages/shared';

import { baseUrl } from '#src/api/apiConstants.js';

/**
 * Log out the user and destroy its session.
 */
export const getPublicLogout = () => {
  return getRequest<GetPublicLogoutResponseBody>({
    baseUrl,
    endpoint: '/public/logout',
  });
};

/**
 * Exchange an authentication code from osu! Oauth for a user bearer token + init a session.
 */
export const postPublicLogin = (authenticationCode: string) => {
  return postRequest<PostPublicOauthResponseBody>({
    baseUrl,
    endpoint: '/public/oauth',
    payload: { code: authenticationCode },
  });
};
