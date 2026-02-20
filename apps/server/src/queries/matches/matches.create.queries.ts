import { database } from '#src/dependencies/database.dependency.js';
import {
  type InsertMatch,
  matchesTable,
} from '#src/schemas/matches/matches.matches.table.js';

export const createMatch = async (matchData: InsertMatch) => {
  const [match] = await database
    .insert(matchesTable)
    .values(matchData)
    .returning();

  return match;
};
