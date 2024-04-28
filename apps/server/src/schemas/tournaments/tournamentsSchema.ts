import { pgSchema } from 'drizzle-orm/pg-core';

export const tournamentsSchema = pgSchema('tournaments');

export const scoreModeEnum = tournamentsSchema.enum('scoreMode', [
  'accuracy',
  'combo',
  'score',
  'scoreV2',
]);

export const teamModeEnum = tournamentsSchema.enum('teamMode', [
  'headToHead',
  'tagCoOp',
  'tagTeamVs',
  'teamVs',
]);
