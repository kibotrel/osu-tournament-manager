import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp } from 'drizzle-orm/pg-core';

import { picksTable } from '#src/schemas/mappools/picksTable.js';
import {
  draftTypeEnum,
  matchesSchema,
} from '#src/schemas/matches/matchesSchema.js';
import { matchesTable } from '#src/schemas/matches/matchesTable.js';
import { teamsTable } from '#src/schemas/tournaments/teamsTable.js';

export const eventsTable = matchesSchema.table('events', {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  draftType: draftTypeEnum('type').notNull(),
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
  tournamentTeamId: integer('tournamentsTeamId')
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

export type SelectEvent = InferSelectModel<typeof eventsTable>;
export type InsertEvent = InferInsertModel<typeof eventsTable>;
