import type {
  CacheListKey,
  CacheSetKey,
  CacheStringKey,
} from '#src/@types/cache/cache.types.js';
import { cache } from '#src/dependencies/cache.dependency.js';

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

export const getStringFromCacheByKey = async (
  key: CacheStringKey,
): Promise<string | null> => {
  return await cache.get(key);
};
