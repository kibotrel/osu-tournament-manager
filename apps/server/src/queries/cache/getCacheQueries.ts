import type { CacheSetKey } from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export const getSetFromCacheByKey = async (
  key: CacheSetKey,
): Promise<string[]> => {
  return await cache.sMembers(key);
};
