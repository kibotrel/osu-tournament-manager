import { pgSchema } from 'drizzle-orm/pg-core';

import { MatchDraftType } from '@packages/shared';

export const matchesSchema = pgSchema('matches');

export const draftTypeEnum = matchesSchema.enum('draftType', [
  MatchDraftType.Ban,
  MatchDraftType.Pick,
  MatchDraftType.Protect,
]);
