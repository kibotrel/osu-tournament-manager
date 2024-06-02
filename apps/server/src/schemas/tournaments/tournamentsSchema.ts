import { TournamentScoreModes, TournamentTeamModes } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const tournamentsSchema = pgSchema('tournaments');

export const scoreModeEnum = tournamentsSchema.enum('scoreMode', [
  TournamentScoreModes.Accuracy,
  TournamentScoreModes.Combo,
  TournamentScoreModes.Score,
  TournamentScoreModes.ScoreV2,
]);

export const teamModeEnum = tournamentsSchema.enum('teamMode', [
  TournamentTeamModes.HeadToHead,
  TournamentTeamModes.TagCoOp,
  TournamentTeamModes.TagTeamVs,
  TournamentTeamModes.TeamVs,
]);
