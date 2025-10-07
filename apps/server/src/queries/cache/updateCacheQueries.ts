/* eslint-disable unicorn/prefer-ternary */
import type {
  AddToCacheOptions,
  CacheListKey,
  CacheSetKey,
} from '#src/@types/cache/cacheTypes.js';
import { cache } from '#src/dependencies/cacheDependency.js';

export const addToListInCacheByKey = async (
  options: AddToCacheOptions<CacheListKey>,
) => {
  const { key, value, expiryInSeconds } = options;

  if (expiryInSeconds) {
    await cache.multi().rPush(key, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.rPush(key, value);
  }
};

export const addToSetInCacheByKey = async (
  options: AddToCacheOptions<CacheSetKey>,
) => {
  const { expiryInSeconds, key, value } = options;

  if (expiryInSeconds) {
    await cache.multi().sAdd(key, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.sAdd(key, value);
  }
};

export const removeFromListInCacheByKey = async (
  options: AddToCacheOptions<CacheListKey>,
) => {
  const { expiryInSeconds, key, value } = options;

  if (expiryInSeconds) {
    await cache.multi().lRem(key, 0, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.lRem(key, 0, value);
  }
};

export const removeFromSetInCacheByKey = async (
  options: AddToCacheOptions<CacheSetKey>,
) => {
  const { expiryInSeconds, key, value } = options;

  if (expiryInSeconds) {
    await cache.multi().sRem(key, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.sRem(key, value);
  }
};
