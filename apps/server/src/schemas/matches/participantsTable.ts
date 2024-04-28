import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp } from 'drizzle-orm/pg-core';

import { matchesSchema } from '#src/schemas/matches/matchesSchema.js';
import { matchesTable } from '#src/schemas/matches/matchesTable.js';
import { teamsTable } from '#src/schemas/tournaments/teamsTable.js';

export const participantsTable = matchesSchema.table('participants', {
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

export type SelectParticipant = InferSelectModel<typeof participantsTable>;
export type InsertParticipant = InferInsertModel<typeof participantsTable>;
