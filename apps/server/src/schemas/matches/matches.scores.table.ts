import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  doublePrecision,
  integer,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';

import { picksTable } from '#src/schemas/mappools/mappools.picks.table.js';
import { matchesSchema } from '#src/schemas/matches/matches.schema.js';
import { matchesTable } from '#src/schemas/matches/matches.matches.table.js';
import { playersTable } from '#src/schemas/tournaments/tournaments.players.table.js';
import { teamsTable } from '#src/schemas/tournaments/tournaments.teams.table.js';

export const scoresTable = matchesSchema.table('scores', {
  accuracy: doublePrecision('accuracy').notNull(),
  countGood: integer('countGood').notNull().default(0),
  countGreat: integer('countGreat').notNull().default(0),
  countMeh: integer('countMeh').notNull().default(0),
  countMiss: integer('countMiss').notNull().default(0),
  countOk: integer('countOk').notNull().default(0),
  countPerfect: integer('countPerfect').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  mappoolPickId: integer('mappoolPickId')
    .notNull()
    .references(
      () => {
        return picksTable.id;
      },
      { onDelete: 'restrict' },
    ),
  matchId: integer('matchId')
    .notNull()
    .references(
      () => {
        return matchesTable.id;
      },
      { onDelete: 'cascade' },
    ),
  maxCombo: integer('maxCombo').notNull(),
  score: integer('score').notNull(),
  tournamentPlayerId: integer('tournamentPlayerId')
    .notNull()
    .references(
      () => {
        return playersTable.id;
      },
      { onDelete: 'restrict' },
    ),
  tournamentTeamId: integer('tournamentTeamId')
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

export type SelectScore = InferSelectModel<typeof scoresTable>;
export type InsertScore = InferInsertModel<typeof scoresTable>;
