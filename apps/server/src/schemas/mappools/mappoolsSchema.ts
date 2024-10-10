import { MappoolGameMode } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const mappoolsSchema = pgSchema('mappools');

export const gameModeEnum = mappoolsSchema.enum('gameMode', [
  MappoolGameMode.Catch,
  MappoolGameMode.Mania,
  MappoolGameMode.Standard,
  MappoolGameMode.Taiko,
]);
