import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, smallint, timestamp } from 'drizzle-orm/pg-core';

import { matchesSchema } from '#src/schemas/matches/matchesSchema.js';
import { matchesTable } from '#src/schemas/matches/matchesTable.js';
import { teamsTable } from '#src/schemas/tournaments/teamsTable.js';
import { tournamentsTable } from '#src/schemas/tournaments/tournamentsTable.js';

export const rollsTable = matchesSchema.table('rolls', {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  matchId: integer('matchId')
    .notNull()
    .references(
      () => {
        return matchesTable.id;
      },
      { onDelete: 'cascade' },
    ),
  roll: smallint('roll').notNull(),
  tournamentId: integer('tournamentId')
    .notNull()
    .references(
      () => {
        return tournamentsTable.id;
      },
      { onDelete: 'cascade' },
    ),
  tournamentsTeamId: integer('tournamentsTeamId')
    .notNull()
    .references(
      () => {
        return teamsTable.id;
      },
      { onDelete: 'restrict' },
    ),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
});

export type SelectRoll = InferSelectModel<typeof rollsTable>;
export type InsertRoll = InferInsertModel<typeof rollsTable>;
