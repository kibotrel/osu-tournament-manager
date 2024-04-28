import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp } from 'drizzle-orm/pg-core';

import { teamsTable } from '#src/schemas/tournaments/teamsTable.js';
import { tournamentsSchema } from '#src/schemas/tournaments/tournamentsSchema.js';
import { tournamentsTable } from '#src/schemas/tournaments/tournamentsTable.js';
import { usersTable } from '#src/schemas/users/usersTable.js';

export const playersTable = tournamentsSchema.table('players', {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  tournamentId: integer('tournamentId')
    .notNull()
    .references(
      () => {
        return tournamentsTable.id;
      },
      { onDelete: 'cascade' },
    ),
  tournamentTeamId: integer('tournamentTeamId')
    .notNull()
    .references(
      () => {
        return teamsTable.id;
      },
      { onDelete: 'cascade' },
    ),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
  userId: integer('userId')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'restrict' },
    ),
});

export type SelectPlayer = InferSelectModel<typeof playersTable>;
export type InsertPlayer = InferInsertModel<typeof playersTable>;
