import type { OsuGetMeResponseBody } from '@packages/osu-sdk';

import { MetricsCollector } from '#src/classes/metricsCollectorClass.js';
import { createUser } from '#src/queries/users/createUserQueries.js';
import { getUserByGameUserId } from '#src/queries/users/getUserQueries.js';

export const getOrCreateUser = async (
  gameUser: OsuGetMeResponseBody,
  requestId: string,
) => {
  const metricsCollector = new MetricsCollector({ requestId });

  metricsCollector.startTracking({
    name: 'getUserByGameUserId',
  });

  const user = await getUserByGameUserId(gameUser.id);

  metricsCollector.stopTracking('getUserByGameUserId');

  if (user) {
    return { isNew: false, user };
  }

  const { id, ...properties } = gameUser;

  metricsCollector.startTracking({
    name: 'createUser',
  });

  const newUser = await createUser({ ...properties, gameUserId: id });

  metricsCollector.stopTracking('createUser');

  return { isNew: true, user: newUser };
};
