import type {
  CacheListKey,
  CacheSetKey,
} from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export const getListFromCacheByKey = async (
  key: CacheListKey,
): Promise<string[]> => {
  return await cache.lRange(key, 0, -1);
};

export const getSetFromCacheByKey = async (
  key: CacheSetKey,
): Promise<string[]> => {
  return await cache.sMembers(key);
};
