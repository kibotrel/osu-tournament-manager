import { eq } from 'drizzle-orm';

import { database } from '#src/dependencies/databaseDependency.js';
import type { InsertMatch } from '#src/schemas/matches/matchesTable.js';
import { matchesTable } from '#src/schemas/matches/matchesTable.js';

export const patchMatchById = async (
  id: number,
  options: Partial<Omit<InsertMatch, 'id' | 'createdAt' | 'updatedAt'>>,
) => {
  const { rowCount } = await database
    .update(matchesTable)
    .set(options)
    .where(eq(matchesTable.id, id));

  return { success: rowCount === 1 };
};
