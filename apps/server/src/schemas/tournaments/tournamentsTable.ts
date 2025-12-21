import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import {
  teamModeEnum,
  tournamentsSchema,
  winConditionEnum,
} from '#src/schemas/tournaments/tournamentsSchema.js';

export const tournamentsTable = tournamentsSchema.table('tournaments', {
  acronym: varchar('acronym', { length: 32 }).notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  endsAt: timestamp('endsAt'),
  id: serial('id').primaryKey(),
  includesQualifierStage: boolean('includesQualifierStage').notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  winCondition: winConditionEnum('winCondition').notNull(),
  startsAt: timestamp('startsAt').notNull(),
  teamMode: teamModeEnum('teamMode').notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
});

export type SelectTournament = InferSelectModel<typeof tournamentsTable>;
export type InsertTournament = InferInsertModel<typeof tournamentsTable>;
