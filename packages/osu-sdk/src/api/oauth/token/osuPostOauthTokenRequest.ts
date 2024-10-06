import { postRequest } from '@packages/shared';

import { baseUrl } from '#src/constants/osuConstants.js';
import { OsuOauthGrantTypes } from '#src/types/osuTypes.js';

export interface OsuPostOauthTokenRequestBody {
  clientId: number;
  clientSecret: string;
  code: string;
  redirectUri: string;
}

export interface OsuPostOauthTokenResponseBody {
  expiresIn: number;
  refreshToken: string;
  token: string;
}

interface InternalOsuPostOauthTokenRequestBody {
  client_id: number;
  client_secret: string;
  code: string;
  grant_type: OsuOauthGrantTypes.AuthorizationCode;
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
  const { clientId, clientSecret, code, redirectUri } = options;
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
      grant_type: OsuOauthGrantTypes.AuthorizationCode,
      redirect_uri: redirectUri,
    },
  });

  if (!response.isOk) {
    throw new Error(
      '[osu!api]: Failed to exchange authentication code for bearer token',
    );
  }

  return {
    expiresIn: response.data.expires_in,
    refreshToken: response.data.refresh_token,
    token: response.data.access_token,
  };
};
