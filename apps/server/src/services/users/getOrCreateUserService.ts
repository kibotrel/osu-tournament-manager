import type { OsuGetMeResponseBody } from '@packages/osu-sdk';

import { MetricsCollector } from '#src/classes/metricsCollectorClass.js';
import { createUser } from '#src/queries/users/createUserQueries.js';
import { getUserByGameUserId } from '#src/queries/users/getUserQueries.js';

export const getOrCreateUser = async (gameUser: OsuGetMeResponseBody) => {
  const metricsCollector = new MetricsCollector();

  metricsCollector.startTracking({
    name: 'getUserByGameUserId',
  });

  const user = await getUserByGameUserId(gameUser.id);

  metricsCollector.stopTracking('getUserByGameUserId');

  if (user) {
    return { isNew: false, user, metrics: metricsCollector.serialize() };
  }

  const { id, ...properties } = gameUser;

  metricsCollector.startTracking({
    name: 'createUser',
  });

  const newUser = await createUser({ ...properties, gameUserId: id });

  metricsCollector.stopTracking('createUser');

  return { isNew: true, user: newUser, metrics: metricsCollector.serialize() };
};
