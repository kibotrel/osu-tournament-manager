import { database } from '#src/dependencies/database.dependency.js';
import type { InsertUser } from '#src/schemas/users/users.users.table.js';
import { usersTable } from '#src/schemas/users/users.users.table.js';

export const createUser = async (userData: InsertUser) => {
  const [user] = await database.insert(usersTable).values(userData).returning();

  return user;
};
