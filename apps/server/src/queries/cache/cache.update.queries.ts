/* eslint-disable unicorn/prefer-ternary */
import type {
  AddToCacheOptions,
  CacheListKey,
  CacheSetKey,
  CacheStringKey,
} from '#src/@types/cache/cache.types.js';
import { cache } from '#src/dependencies/cache.dependency.js';

export const addToListInCacheByKeyQuery = async (
  options: AddToCacheOptions<CacheListKey>,
) => {
  const { key, value, expiryInSeconds } = options;

  if (expiryInSeconds) {
    await cache.multi().rPush(key, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.rPush(key, value);
  }
};

export const addToSetInCacheByKeyQuery = async (
  options: AddToCacheOptions<CacheSetKey>,
) => {
  const { expiryInSeconds, key, value } = options;

  if (expiryInSeconds) {
    await cache.multi().sAdd(key, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.sAdd(key, value);
  }
};

export const removeFromListInCacheByKeyQuery = async (
  options: AddToCacheOptions<CacheListKey>,
) => {
  const { expiryInSeconds, key, value } = options;

  if (expiryInSeconds) {
    await cache.multi().lRem(key, 0, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.lRem(key, 0, value);
  }
};

export const removeFromSetInCacheByKeyQuery = async (
  options: AddToCacheOptions<CacheSetKey>,
) => {
  const { expiryInSeconds, key, value } = options;

  if (expiryInSeconds) {
    await cache.multi().sRem(key, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.sRem(key, value);
  }
};

export const setStringInCacheByKeyQuery = async (
  options: AddToCacheOptions<CacheStringKey>,
) => {
  const { expiryInSeconds, key, value } = options;

  if (expiryInSeconds) {
    await cache.multi().set(key, value).expire(key, expiryInSeconds).exec();
  } else {
    await cache.set(key, value);
  }
};
