import { eq, getTableColumns } from 'drizzle-orm';
import type { SelectedFields } from 'drizzle-orm/pg-core';

import { database } from '#src/dependencies/database.dependency.js';
import {
  type SelectMatch,
  matchesTable,
} from '#src/schemas/matches/matches.matches.table.js';

export const getMatchByIdQuery = async <
  Columns extends ReadonlyArray<keyof SelectMatch> = [],
>(
  id: number,
  options: { columnsFilter?: Columns } = {},
) => {
  const { columnsFilter = [] } = options;
  const selectedColumns: SelectedFields =
    columnsFilter.length === 0 ? getTableColumns(matchesTable) : {};

  for (const field of columnsFilter) {
    selectedColumns[field] = matchesTable[field];
  }

  const [match] = await database
    .select(selectedColumns)
    .from(matchesTable)
    .where(eq(matchesTable.id, id));

  if (!match) {
    return null;
  }

  return match as Columns extends []
    ? SelectMatch | null
    : Pick<SelectMatch, Columns[number]> | null;
};

export const getMatchByGameMatchIdQuery = async <
  Columns extends ReadonlyArray<keyof SelectMatch> = [],
>(
  gameMatchId: number,
  options: { columnsFilter?: Columns } = {},
) => {
  const { columnsFilter = [] } = options;
  const selectedColumns: SelectedFields =
    columnsFilter.length === 0 ? getTableColumns(matchesTable) : {};

  for (const field of columnsFilter) {
    selectedColumns[field] = matchesTable[field];
  }

  const [match] = await database
    .select(selectedColumns)
    .from(matchesTable)
    .where(eq(matchesTable.gameMatchId, gameMatchId));

  if (!match) {
    return null;
  }

  return match as Columns extends []
    ? SelectMatch | null
    : Pick<SelectMatch, Columns[number]> | null;
};
