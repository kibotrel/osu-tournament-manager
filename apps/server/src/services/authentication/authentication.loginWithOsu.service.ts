import { osuGetMeQuery, osuPostOauthTokenQuery } from '@packages/osu-sdk';

import { environmentConfig } from '#src/configs/environment.config.js';
import { getOrCreateUserService } from '#src/services/users/users.getOrCreate.service.js';

/**
 * Use code given by osu! Oauth, exchange it for an access token, and get game user's information.
 * If user doesn't exist in the database yet create it.
 */
export const loginWithOsuService = async (authenticationCode: string) => {
  const bearer = await osuPostOauthTokenQuery({
    clientId: environmentConfig.osuClientId,
    clientSecret: environmentConfig.osuClientSecret,
    authenticationCode,
    redirectUri: `${environmentConfig.baseUrl}/oauth/callback`,
  });
  const gameUser = await osuGetMeQuery({ token: bearer.token });
  const { isNew, user } = await getOrCreateUserService(gameUser);

  return { bearer, isNew, user };
};
