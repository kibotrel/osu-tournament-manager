import { BanchoTeamMode, BanchoWinCondition } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

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
