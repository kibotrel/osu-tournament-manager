import { HttpError, postRequest } from '@packages/shared';

import { BASE_URL, OsuOauthGrantType } from '#src/constants/osu.constants.js';

export interface OsuPostOauthTokenRequestBody {
  clientId: number;
  clientSecret: string;
  authenticationCode: string;
  redirectUri: string;
}

export interface OsuPostOauthTokenResponseBody {
  expiryTimestamp: number;
  refreshToken: string;
  token: string;
}

interface InternalOsuPostOauthTokenRequestBody {
  client_id: number;
  client_secret: string;
  code: string;
  grant_type: OsuOauthGrantType.AuthorizationCode;
  redirect_uri: string;
}

interface InternalOsuPostOauthTokenResponseBody {
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
export const osuPostOauthToken = async (
  options: OsuPostOauthTokenRequestBody,
): Promise<OsuPostOauthTokenResponseBody> => {
  const { clientId, clientSecret, authenticationCode, redirectUri } = options;
  const response = await postRequest<
    InternalOsuPostOauthTokenRequestBody,
    InternalOsuPostOauthTokenResponseBody
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

export interface OsuPostOauthTokenRefreshRequestBody {
  clientId: number;
  clientSecret: string;
  refreshToken: string;
}

export type OsuPostOauthTokenRefreshResponseBody =
  OsuPostOauthTokenResponseBody;

interface InternalOsuPostOauthTokenRefreshRequestBody {
  client_id: number;
  client_secret: string;
  grant_type: OsuOauthGrantType.RefreshToken;
  refresh_token: string;
}

type InternalOsuPostOauthTokenRefreshResponseBody =
  InternalOsuPostOauthTokenResponseBody;

/**
 * Refresh Oauth token based on a previously issued refresh token.
 *
 * See {@link https://osu.ppy.sh/docs/index.html#client-credentials-grant | Client Credentials Grant}
 * for more information.
 */
export const osuPostOauthTokenRefresh = async (
  options: OsuPostOauthTokenRefreshRequestBody,
): Promise<OsuPostOauthTokenRefreshResponseBody> => {
  const { clientId, clientSecret, refreshToken } = options;
  const response = await postRequest<
    InternalOsuPostOauthTokenRefreshRequestBody,
    InternalOsuPostOauthTokenRefreshResponseBody
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
