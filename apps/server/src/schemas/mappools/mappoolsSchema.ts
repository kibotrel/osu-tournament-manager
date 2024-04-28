import { pgSchema } from 'drizzle-orm/pg-core';

export const mappoolsSchema = pgSchema('mappools');

export const gameModeEnum = mappoolsSchema.enum('gameMode', [
  'catch',
  'mania',
  'standard',
  'taiko',
]);
