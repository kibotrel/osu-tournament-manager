import { MatchDraftType } from '@packages/shared';
import { pgSchema } from 'drizzle-orm/pg-core';

export const matchesSchema = pgSchema('matches');

export const draftTypeEnum = matchesSchema.enum('draftType', [
  MatchDraftType.Ban,
  MatchDraftType.Pick,
  MatchDraftType.Protect,
]);
