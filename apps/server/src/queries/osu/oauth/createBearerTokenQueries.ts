import { osuPostOauthToken } from '@packages/osu-sdk';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { OsuGrantTypes } from '#src/constants/osuConstants.js';

export interface CreateOsuApitBearerTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface OsuBearerToken {
  token: string;
}

/**
 * Exchange the `code` for an osu! API bearer token which can be used to authenticate later requests.
 */
export const createOsuApiBearerToken = async (
  code: string,
): Promise<OsuBearerToken> => {
  const { token } = await osuPostOauthToken({
    clientId: environmentConfig.osuClientId,
    clientSecret: environmentConfig.osuClientSecret,
    code,
    grantType: OsuGrantTypes.AuthorizationCode,
    redirectUri: `${environmentConfig.baseUrl}/oauth/callback`,
  });

  return { token };
};
