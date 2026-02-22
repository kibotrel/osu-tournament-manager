import { postRequest } from '@packages/shared';

import { BASE_URL, OsuOauthGrantType } from '#src/constants/osu.constants.js';

export interface OsuPostOauthTokenRefreshQueryRequestBody {
  clientId: number;
  clientSecret: string;
  refreshToken: string;
}

export interface OsuPostOauthTokenRefreshQueryResponseBody {
  expiryTimestamp: number;
  refreshToken: string;
  token: string;
}

interface InternalOsuPostOauthTokenRefreshQueryResponseBody {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: 'Bearer';
}

interface InternalOsuPostOauthTokenRefreshQueryRequestBody {
  client_id: number;
  client_secret: string;
  grant_type: OsuOauthGrantType.RefreshToken;
  refresh_token: string;
}

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
