import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { usersSchema } from '#src/schemas/users/usersSchema.js';

export const usersTable = usersSchema.table('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  gameUserId: integer('gameUserId').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
});

export type SelectUser = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;
