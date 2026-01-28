import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  serial,
  smallint,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { mappoolsTable } from '#src/schemas/mappools/mappoolsTable.js';
import { matchesSchema } from '#src/schemas/matches/matchesSchema.js';
import { teamsTable } from '#src/schemas/tournaments/teamsTable.js';
import { tournamentsTable } from '#src/schemas/tournaments/tournamentsTable.js';

export const matchesTable = matchesSchema.table(
  'matches',
  {
    bansPerTeam: integer('bansPerTeam').notNull(),
    bestOf: smallint('bestOf').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    endsAt: timestamp('endsAt'),
    gameMatchId: integer('gameMatchId').notNull().unique(),
    id: serial('id').primaryKey(),
    isQualifierMatch: boolean('isQualifierMatch').notNull(),
    mappoolId: integer('mappoolId')
      .notNull()
      .references(
        () => {
          return mappoolsTable.id;
        },
        { onDelete: 'restrict' },
      ),
    name: varchar('name').notNull(),
    protectsPerTeam: integer('protectsPerTeam').notNull(),
    startsAt: timestamp('startsAt'),
    tournamentId: integer('tournamentId')
      .notNull()
      .references(
        () => {
          return tournamentsTable.id;
        },
        { onDelete: 'cascade' },
      ),
    updatedAt: timestamp('updatedAt')
      .notNull()
      .defaultNow()
      .$onUpdate(() => {
        return new Date();
      }),
    winnerTournamentTeamId: integer('winnerTournamentTeamId').references(
      () => {
        return teamsTable.id;
      },
      { onDelete: 'restrict' },
    ),
  },
  (table) => {
    return [index().on(table.gameMatchId)];
  },
);

export type SelectMatch = InferSelectModel<typeof matchesTable>;
export type InsertMatch = InferInsertModel<typeof matchesTable>;
