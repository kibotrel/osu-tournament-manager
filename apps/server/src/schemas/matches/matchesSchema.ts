import { MatchDraftTypes } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const matchesSchema = pgSchema('matches');

export const draftTypeEnum = matchesSchema.enum('draftType', [
  MatchDraftTypes.Ban,
  MatchDraftTypes.Pick,
  MatchDraftTypes.Protect,
]);
