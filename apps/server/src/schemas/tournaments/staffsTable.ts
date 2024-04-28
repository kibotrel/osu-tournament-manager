import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, smallint, timestamp } from 'drizzle-orm/pg-core';

import { tournamentsSchema } from '#src/schemas/tournaments/tournamentsSchema.js';
import { tournamentsTable } from '#src/schemas/tournaments/tournamentsTable.js';
import { usersTable } from '#src/schemas/users/usersTable.js';

export const staffsTable = tournamentsSchema.table('staffs', {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  permissionsBitfield: smallint('permissionsBitfield').notNull(),
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
  userId: integer('userId')
    .notNull()
    .references(
      () => {
        return usersTable.id;
      },
      { onDelete: 'restrict' },
    ),
});

export type SelectStaff = InferSelectModel<typeof staffsTable>;
export type InsertStaff = InferInsertModel<typeof staffsTable>;
