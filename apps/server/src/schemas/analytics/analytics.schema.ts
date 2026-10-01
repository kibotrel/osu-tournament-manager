import { pgSchema } from 'drizzle-orm/pg-core';

import { LogLevel } from '@packages/logger';

export const analyticsSchema = pgSchema('analytics');

export const logLevelEnum = analyticsSchema.enum('logLevel', [
  LogLevel.Debug,
  LogLevel.Error,
  LogLevel.Http,
  LogLevel.Info,
  LogLevel.Silly,
  LogLevel.Verbose,
  LogLevel.Warn,
]);
