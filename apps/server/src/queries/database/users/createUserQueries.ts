import { database } from '#src/dependencies/databaseDependency.js';
import type { InsertUser, SelectUser } from '#src/schemas/users/usersTable.js';
import { usersTable } from '#src/schemas/users/usersTable.js';

export const createUser = async (userData: InsertUser): Promise<SelectUser> => {
  const [user] = await database.insert(usersTable).values(userData).returning();

  return user;
};
