import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import {
  gameModeEnum,
  mappoolsSchema,
} from '#src/schemas/mappools/mappoolsSchema.js';
import { mappoolsTable } from '#src/schemas/mappools/mappoolsTable.js';
import { tournamentsTable } from '#src/schemas/tournaments/tournamentsTable.js';

export const picksTable = mappoolsSchema.table('picks', {
  artist: varchar('artist').notNull(),
  beatmapId: integer('beatmapId').notNull(),
  beatmapSetId: integer('beatmapSetId').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  difficulty: varchar('difficulty').notNull(),
  gameMode: gameModeEnum('gameMode').notNull(),
  id: serial('id').primaryKey(),
  mods: varchar('mods', { length: 256 }).notNull().default(''),
  mapperName: varchar('mapperName').notNull(),
  mappoolId: integer('mappoolId')
    .notNull()
    .references(
      () => {
        return mappoolsTable.id;
      },
      { onDelete: 'cascade' },
    ),
  title: varchar('title').notNull(),
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

export type SelectPick = InferSelectModel<typeof picksTable>;
export type InsertPick = InferInsertModel<typeof picksTable>;
