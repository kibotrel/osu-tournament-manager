import type { OsuGetMeQueryResponseBody } from '@packages/osu-sdk';

import { createUserQuery } from '#src/queries/users/users.create.queries.js';
import { getUserByGameUserIdQuery } from '#src/queries/users/users.get.queries.js';

export const getOrCreateUserService = async (
  gameUser: OsuGetMeQueryResponseBody,
) => {
  const user = await getUserByGameUserIdQuery(gameUser.id);

  if (user) {
    return { isNew: false, user };
  }

  const { id, ...properties } = gameUser;
  const newUser = await createUserQuery({ ...properties, gameUserId: id });

  return { isNew: true, user: newUser };
};
