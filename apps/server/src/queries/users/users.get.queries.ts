import { eq, getTableColumns } from 'drizzle-orm';
import type { SelectedFields } from 'drizzle-orm/pg-core';

import { database } from '#src/dependencies/database.dependency.js';
import type { SelectUser } from '#src/schemas/users/users.users.table.js';
import { usersTable } from '#src/schemas/users/users.users.table.js';

export const getUserByGameUserId = async <
  Columns extends ReadonlyArray<keyof SelectUser> = [],
>(
  gameUserId: number,
  options: { columnsFilter?: Columns } = {},
) => {
  const { columnsFilter = [] } = options;
  const selectedColumns: SelectedFields =
    columnsFilter.length === 0 ? getTableColumns(usersTable) : {};

  for (const field of columnsFilter) {
    selectedColumns[field] = usersTable[field];
  }

  const [user] = await database
    .select(selectedColumns)
    .from(usersTable)
    .where(eq(usersTable.gameUserId, gameUserId));

  if (!user) {
    return null;
  }

  return user as Columns extends []
    ? SelectUser | null
    : Pick<SelectUser, Columns[number]> | null;
};
