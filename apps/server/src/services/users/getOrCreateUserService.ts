import { createUser } from '#src/queries/database/users/createUserQueries.js';
import { getUserByGameUserId } from '#src/queries/database/users/getUserQueries.js';
import type { OsuUser } from '#src/queries/osu/users/getUserQueries.js';

export const getOrCreateUser = async (osuUser: OsuUser) => {
  const user = await getUserByGameUserId(osuUser.gameUserId);

  if (user) {
    return { isNew: false, user };
  }

  const newUser = await createUser(osuUser);

  return { isNew: true, user: newUser };
};
