import { BanchoScoreMode, BanchoTeamMode } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const tournamentsSchema = pgSchema('tournaments');

export const scoreModeEnum = tournamentsSchema.enum('scoreMode', [
  BanchoScoreMode.Accuracy,
  BanchoScoreMode.Combo,
  BanchoScoreMode.Score,
  BanchoScoreMode.ScoreV2,
]);

export const teamModeEnum = tournamentsSchema.enum('teamMode', [
  BanchoTeamMode.HeadToHead,
  BanchoTeamMode.TagCoOp,
  BanchoTeamMode.TagTeamVs,
  BanchoTeamMode.TeamVs,
]);
