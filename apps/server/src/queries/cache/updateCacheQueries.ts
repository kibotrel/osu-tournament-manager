import type {
  AddToCacheOptions,
  CacheListKey,
  CacheSetKey,
} from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export const addToListInCacheByKey = async (
  options: AddToCacheOptions<CacheListKey>,
) => {
  const { key, value } = options;

  await cache.rPush(key, value);
};

export const addToSetInCacheByKey = async (
  options: AddToCacheOptions<CacheSetKey>,
) => {
  const { key, value } = options;

  await cache.sAdd(key, value);
};

export const removeFromListInCacheByKey = async (
  options: AddToCacheOptions<CacheListKey>,
) => {
  const { key, value } = options;

  await cache.lRem(key, 0, value);
};

export const removeFromSetInCacheByKey = async (
  options: AddToCacheOptions<CacheSetKey>,
) => {
  const { key, value } = options;

  await cache.sRem(key, value);
};
