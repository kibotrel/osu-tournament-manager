import { MappoolGameModes } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const mappoolsSchema = pgSchema('mappools');

export const gameModeEnum = mappoolsSchema.enum('gameMode', [
  MappoolGameModes.Catch,
  MappoolGameModes.Mania,
  MappoolGameModes.Standard,
  MappoolGameModes.Taiko,
]);
