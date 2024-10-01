import { postRequest } from '@packages/shared';

import { baseUrl } from '#src/constants/index.js';

export interface OsuPostOauthTokenRequestBody {
  clientId: number;
  clientSecret: string;
  code: string;
  grantType: string;
  redirectUri: string;
}

export interface OsuPostOauthTokenResponseBody {
  refreshToken: string;
  token: string;
}

interface InternalOsuPostOauthTokenRequestBody {
  client_id: number;
  client_secret: string;
  code: string;
  grant_type: string;
  redirect_uri: string;
}

interface InternalOsuPostOauthTokenResponseBody {
  access_token: string;
  refresh_token: string;
}

/**
 * Exchange a code for an access token.
 */
export const osuPostOauthToken = async (
  options: OsuPostOauthTokenRequestBody,
) => {
  const { clientId, clientSecret, code, grantType, redirectUri } = options;
  const response = await postRequest<
    InternalOsuPostOauthTokenRequestBody,
    InternalOsuPostOauthTokenResponseBody
  >({
    baseApiEndpoint: '',
    baseUrl,
    apiVersion: '',
    endpoint: '/oauth/token',
    payload: {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: grantType,
      redirect_uri: redirectUri,
    },
  });

  if (!response.isOk) {
    throw new Error(
      '[osu!api]: Failed to exchange authentication code for bearer token',
    );
  }

  return {
    refreshToken: response.data.refresh_token,
    token: response.data.access_token,
  };
};
