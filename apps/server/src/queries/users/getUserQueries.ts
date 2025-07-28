import { eq, getTableColumns } from 'drizzle-orm';
import type { SelectedFields } from 'drizzle-orm/pg-core';

import { database } from '#src/dependencies/databaseDependency.js';
import type { SelectUser } from '#src/schemas/users/usersTable.js';
import { usersTable } from '#src/schemas/users/usersTable.js';

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
    return;
  }

  return user as Columns extends []
    ? SelectUser | null
    : Pick<SelectUser, Columns[number]> | null;
};
