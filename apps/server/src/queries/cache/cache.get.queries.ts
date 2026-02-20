import type {
  CacheListKey,
  CacheSetKey,
  CacheStringKey,
} from '#src/@types/cache/cache.types.js';
import { cache } from '#src/dependencies/cache.dependency.js';

export const getListFromCacheByKeyQuery = async (
  key: CacheListKey,
): Promise<string[]> => {
  return await cache.lRange(key, 0, -1);
};

export const getSetFromCacheByKeyQuery = async (
  key: CacheSetKey,
): Promise<string[]> => {
  return await cache.sMembers(key);
};

export const getStringFromCacheByKeyQuery = async (
  key: CacheStringKey,
): Promise<string | null> => {
  return await cache.get(key);
};
