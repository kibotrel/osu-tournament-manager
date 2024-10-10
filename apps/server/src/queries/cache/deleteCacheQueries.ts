import type { CacheKey } from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export const popCacheArrayByKey = async (key: CacheKey) => {
  const array = cache.lRange(key, 0, -1);

  await cache.del(key);

  return array;
};
