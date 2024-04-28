import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { mappoolsSchema } from '#src/schemas/mappools/mappoolsSchema.js';
import { tournamentsTable } from '#src/schemas/tournaments/tournamentsTable.js';

export const mappoolsTable = mappoolsSchema.table('mappools', {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
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

export type SelectMappool = InferSelectModel<typeof mappoolsTable>;
export type InsertMappool = InferInsertModel<typeof mappoolsTable>;
