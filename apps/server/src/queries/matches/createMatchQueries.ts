import { database } from '#src/dependencies/databaseDependency.js';
import {
  type InsertMatch,
  matchesTable,
} from '#src/schemas/matches/matchesTable.js';

export const createMatch = async (matchData: InsertMatch) => {
  const [match] = await database
    .insert(matchesTable)
    .values(matchData)
    .returning();

  return match;
};
