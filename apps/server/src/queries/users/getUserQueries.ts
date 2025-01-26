import { eq } from 'drizzle-orm';

import { database } from '#src/dependencies/databaseDependency.js';
import type { SelectUser } from '#src/schemas/users/usersTable.js';
import { usersTable } from '#src/schemas/users/usersTable.js';

export const getUserByGameUserId = async (
  gameUserId: number,
): Promise<SelectUser | undefined> => {
  const [user] = await database
    .select()
    .from(usersTable)
    .where(eq(usersTable.gameUserId, gameUserId));

  return user;
};
