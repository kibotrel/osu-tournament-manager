import { pgSchema } from 'drizzle-orm/pg-core';

import { BanchoTeamMode, BanchoWinCondition } from '@packages/shared';

export const tournamentsSchema = pgSchema('tournaments');

export const winConditionEnum = tournamentsSchema.enum('winConditionEnum', [
  BanchoWinCondition.Accuracy,
  BanchoWinCondition.Combo,
  BanchoWinCondition.Score,
  BanchoWinCondition.ScoreV2,
]);

export const teamModeEnum = tournamentsSchema.enum('teamMode', [
  BanchoTeamMode.HeadToHead,
  BanchoTeamMode.TagCoOp,
  BanchoTeamMode.TagTeamVs,
  BanchoTeamMode.TeamVs,
]);
