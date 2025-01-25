import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { json, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import {
  analyticsSchema,
  logLevelEnum,
} from '#src/schemas/analytics/analyticsSchema.js';

export interface ServerLogMetadata {}

export const serverLogsTable = analyticsSchema.table('serverLogs', {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  level: logLevelEnum('level').notNull(),
  message: text('message').notNull(),
  metadata: json('metadata'),
  requestId: uuid('requestId').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  updatedAt: timestamp('updatedAt')
    .notNull()
    .defaultNow()
    .$onUpdate(() => {
      return new Date();
    }),
});

export type SelectServerLog = InferSelectModel<typeof serverLogsTable>;
export type InsertServerLog = InferInsertModel<typeof serverLogsTable>;
