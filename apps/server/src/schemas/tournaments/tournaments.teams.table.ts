import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { tournamentsSchema } from '#src/schemas/tournaments/tournaments.schema.js';
import { tournamentsTable } from '#src/schemas/tournaments/tournaments.tournaments.table.js';

export const teamsTable = tournamentsSchema.table('teams', {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 32 }).notNull(),
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
});

export type SelectTeam = InferSelectModel<typeof teamsTable>;
export type InsertTeam = InferInsertModel<typeof teamsTable>;
