import { HttpError, postRequest } from '@packages/shared';

import { BASE_URL, OsuOauthGrantType } from '#src/constants/osu.constants.js';

export interface OsuPostOauthTokenQueryRequestBody {
  clientId: number;
  clientSecret: string;
  authenticationCode: string;
  redirectUri: string;
}

export interface OsuPostOauthTokenQueryResponseBody {
  expiryTimestamp: number;
  refreshToken: string;
  token: string;
}

interface InternalOsuPostOauthTokenQueryRequestBody {
  client_id: number;
  client_secret: string;
  code: string;
  grant_type: OsuOauthGrantType.AuthorizationCode;
  redirect_uri: string;
}

interface InternalOsuPostOauthTokenQueryResponseBody {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
}

/**
 * Exchange an Oauth code for an access token.
 *
 * See {@link https://osu.ppy.sh/docs/index.html#client-credentials-grant | Client Credentials Grant}
 * for more information.
 */
export const osuPostOauthTokenQuery = async (
  options: OsuPostOauthTokenQueryRequestBody,
): Promise<OsuPostOauthTokenQueryResponseBody> => {
  const { clientId, clientSecret, authenticationCode, redirectUri } = options;
  const response = await postRequest<
    InternalOsuPostOauthTokenQueryRequestBody,
    InternalOsuPostOauthTokenQueryResponseBody
  >({
    baseApiEndpoint: '',
    baseUrl: BASE_URL,
    apiVersion: '',
    endpoint: '/oauth/token',
    payload: {
      client_id: clientId,
      client_secret: clientSecret,
      code: authenticationCode,
      grant_type: OsuOauthGrantType.AuthorizationCode,
      redirect_uri: redirectUri,
    },
  });

  if (!response.isOk) {
    throw new HttpError({
      message:
        '[osu!api] Failed to exchange authentication code for bearer token',
      status: response.status,
      metadata: response.data as unknown as Record<string, unknown>,
    });
  }

  const remainingTime = response.data.expires_in * 1000;

  return {
    expiryTimestamp: Date.now() + remainingTime,
    refreshToken: response.data.refresh_token,
    token: response.data.access_token,
  };
};

export interface OsuPostOauthTokenRefreshQueryRequestBody {
  clientId: number;
  clientSecret: string;
  refreshToken: string;
}

export type OsuPostOauthTokenRefreshQueryResponseBody =
  OsuPostOauthTokenQueryResponseBody;

interface InternalOsuPostOauthTokenRefreshQueryRequestBody {
  client_id: number;
  client_secret: string;
  grant_type: OsuOauthGrantType.RefreshToken;
  refresh_token: string;
}

type InternalOsuPostOauthTokenRefreshQueryResponseBody =
  InternalOsuPostOauthTokenQueryResponseBody;

/**
 * Refresh Oauth token based on a previously issued refresh token.
 *
 * See {@link https://osu.ppy.sh/docs/index.html#client-credentials-grant | Client Credentials Grant}
 * for more information.
 */
export const osuPostOauthTokenRefreshQuery = async (
  options: OsuPostOauthTokenRefreshQueryRequestBody,
): Promise<OsuPostOauthTokenRefreshQueryResponseBody> => {
  const { clientId, clientSecret, refreshToken } = options;
  const response = await postRequest<
    InternalOsuPostOauthTokenRefreshQueryRequestBody,
    InternalOsuPostOauthTokenRefreshQueryResponseBody
  >({
    baseApiEndpoint: '',
    baseUrl: BASE_URL,
    apiVersion: '',
    endpoint: '/oauth/token',
    payload: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: OsuOauthGrantType.RefreshToken,
      refresh_token: refreshToken,
    },
  });

  if (!response.isOk) {
    throw new Error('[osu!api]: Failed to refresh bearer token');
  }

  const remainingTime = response.data.expires_in * 1000;

  return {
    expiryTimestamp: Date.now() + remainingTime,
    refreshToken: response.data.refresh_token,
    token: response.data.access_token,
  };
};
