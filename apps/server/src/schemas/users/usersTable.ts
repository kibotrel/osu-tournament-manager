import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { usersSchema } from '#src/schemas/users/usersSchema.js';

export const usersTable = usersSchema.table('users', {
  avatarUrl: varchar('avatarUrl').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  gameUserId: integer('gameUserId').notNull().unique(),
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
});

export type SelectUser = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;
