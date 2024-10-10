import type { CacheKey } from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export interface PushCacheElementOptions {
  key: CacheKey;
  value: string;
}

export const pushCacheArrayElementByKey = async (
  options: PushCacheElementOptions,
) => {
  const { key, value } = options;

  await cache.rPush(key, value);
};
