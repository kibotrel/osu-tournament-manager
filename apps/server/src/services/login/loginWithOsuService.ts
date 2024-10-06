import { osuGetMe, osuPostOauthToken } from '@packages/osu-sdk';

import { MetricsCollector } from '#src/classes/metricsCollectorClass.js';
import { environmentConfig } from '#src/configs/environmentConfig.js';
import { getOrCreateUser } from '#src/services/users/getOrCreateUserService.js';

/**
 * Use code given by osu! Oauth, exchange it for an access token, and get game user's information.
 * If user doesn't exist in the database yet create it.
 */
export const loginWithOsu = async (code: string) => {
  const metricsCollector = new MetricsCollector();

  metricsCollector.startTracking({
    name: 'osuPostOauthToken',
  });

  const bearer = await osuPostOauthToken({
    clientId: environmentConfig.osuClientId,
    clientSecret: environmentConfig.osuClientSecret,
    code,
    redirectUri: `${environmentConfig.baseUrl}/oauth/callback`,
  });

  metricsCollector.stopTracking('osuPostOauthToken');
  metricsCollector.startTracking({
    name: 'osuGetMe',
  });

  const gameUser = await osuGetMe({ token: bearer.token });

  metricsCollector.stopTracking('osuGetMe');

  const {
    isNew,
    user,
    metrics: getOrCreateUserMetrics,
  } = await getOrCreateUser(gameUser);

  return {
    bearer,
    isNew,
    metrics: [metricsCollector.serialize(), getOrCreateUserMetrics].join(', '),
    user,
  };
};
