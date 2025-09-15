import { CacheSetTopic } from '#src/constants/cacheConstants.js';
import { addToSetInCacheByKey } from '#src/queries/cache/updateCacheQueries.js';

export const addMatchToCachedSet = async (channel: string) => {
  await addToSetInCacheByKey({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};
