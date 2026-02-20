import { eq } from 'drizzle-orm';

import { database } from '#src/dependencies/database.dependency.js';
import type { InsertMatch } from '#src/schemas/matches/matches.matches.table.js';
import { matchesTable } from '#src/schemas/matches/matches.matches.table.js';

export const patchMatchByGameMatchIdQuery = async (
  gameMatchId: number,
  options: Partial<Omit<InsertMatch, 'id' | 'createdAt' | 'updatedAt'>>,
) => {
  const { rowCount } = await database
    .update(matchesTable)
    .set(options)
    .where(eq(matchesTable.gameMatchId, gameMatchId));

  return { success: rowCount === 1 };
};

export const patchMatchByIdQuery = async (
  id: number,
  options: Partial<Omit<InsertMatch, 'id' | 'createdAt' | 'updatedAt'>>,
) => {
  const { rowCount } = await database
    .update(matchesTable)
    .set(options)
    .where(eq(matchesTable.id, id));

  return { success: rowCount === 1 };
};
