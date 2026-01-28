import { OsuGameMode } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const mappoolsSchema = pgSchema('mappools');

export const gameModeEnum = mappoolsSchema.enum('gameMode', [
  OsuGameMode.Catch,
  OsuGameMode.Mania,
  OsuGameMode.Standard,
  OsuGameMode.Taiko,
]);
