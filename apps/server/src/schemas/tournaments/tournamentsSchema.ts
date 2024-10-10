import { TournamentScoreMode, TournamentTeamMode } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const tournamentsSchema = pgSchema('tournaments');

export const scoreModeEnum = tournamentsSchema.enum('scoreMode', [
  TournamentScoreMode.Accuracy,
  TournamentScoreMode.Combo,
  TournamentScoreMode.Score,
  TournamentScoreMode.ScoreV2,
]);

export const teamModeEnum = tournamentsSchema.enum('teamMode', [
  TournamentTeamMode.HeadToHead,
  TournamentTeamMode.TagCoOp,
  TournamentTeamMode.TagTeamVs,
  TournamentTeamMode.TeamVs,
]);
