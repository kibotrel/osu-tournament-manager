import type { CacheListKey } from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export const deleteListInCacheByKey = async (key: CacheListKey) => {
  const array = await cache.lRange(key, 0, -1);

  await cache.del(key);

  return array;
};
