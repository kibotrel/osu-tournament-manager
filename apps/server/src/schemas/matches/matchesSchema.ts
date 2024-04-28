import { pgSchema } from 'drizzle-orm/pg-core';

export const matchesSchema = pgSchema('matches');

export const draftTypeEnum = matchesSchema.enum('draftType', [
  'ban',
  'pick',
  'protect',
]);
