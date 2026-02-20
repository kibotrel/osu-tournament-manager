import type {
  CacheListKey,
  CacheStringKey,
} from '#src/@types/cache/cache.types.js';
import { cache } from '#src/dependencies/cache.dependency.js';

export const deleteListInCacheByKey = async (key: CacheListKey) => {
  const array = await cache.lRange(key, 0, -1);

  await cache.del(key);

  return array;
};

export const deleteStringInCacheByKey = async (key: CacheStringKey) => {
  await cache.del(key);
};
