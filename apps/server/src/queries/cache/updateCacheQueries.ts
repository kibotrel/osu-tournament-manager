import type { CacheKey } from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';


export const addToListInCacheByKey = async (
  options: AddToCacheOptions<CacheListKey>,
) => {
  const { key, value } = options;

  await cache.rPush(key, value);
};
