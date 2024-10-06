import { osuGetMe, osuPostOauthToken } from '@packages/osu-sdk';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { getOrCreateUser } from '#src/services/users/getOrCreateUserService.js';

/**
 * Use code given by osu! Oauth, exchange it for an access token, and get game user's information.
 * If user doesn't exist in the database yet create it.
 */
export const loginWithOsu = async (code: string) => {
  const bearer = await osuPostOauthToken({
    clientId: environmentConfig.osuClientId,
    clientSecret: environmentConfig.osuClientSecret,
    code,
    redirectUri: `${environmentConfig.baseUrl}/oauth/callback`,
  });
  const gameUser = await osuGetMe({ token: bearer.token });
  const user = await getOrCreateUser(gameUser);

  return { bearer, ...user };
};