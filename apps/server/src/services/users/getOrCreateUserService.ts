import type { OsuGetMeResponseBody } from '@packages/osu-sdk';

import { createUser } from '#src/queries/users/createUserQueries.js';
import { getUserByGameUserId } from '#src/queries/users/getUserQueries.js';

export const getOrCreateUser = async (gameUser: OsuGetMeResponseBody) => {
  const user = await getUserByGameUserId(gameUser.id);

  if (user) {
    return { isNew: false, user };
  }

  const { id, ...properties } = gameUser;
  const newUser = await createUser({ ...properties, gameUserId: id });

  return { isNew: true, user: newUser };
};
