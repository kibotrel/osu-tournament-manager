import { CacheSetTopic } from '#src/constants/cacheConstants.js';
import { getSetFromCacheByKey } from '#src/queries/cache/getCacheQueries.js';
import {
  addToSetInCacheByKey,
  removeFromSetInCacheByKey,
} from '#src/queries/cache/updateCacheQueries.js';

export const addMatchToCachedSet = async (channel: string) => {
  await addToSetInCacheByKey({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};

export const getAllOngoingMatchesFromCache = async () => {
  return await getSetFromCacheByKey(CacheSetTopic.OpenMatches);
};

export const removeMatchFromCachedSet = async (channel: string) => {
  await removeFromSetInCacheByKey({
    key: CacheSetTopic.OpenMatches,
    value: channel,
  });
};
