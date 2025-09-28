import type {
  CacheListTopic,
  CacheSetTopic,
  CacheTopic,
} from '#src/constants/cacheConstants.js';

export type CacheKey = CacheTopic | `${CacheTopic}:${string}`;
export type CacheListKey = CacheListTopic | `${CacheListTopic}:${string}`;
export type CacheSetKey = CacheSetTopic | `${CacheSetTopic}:${string}`;

export interface AddToCacheOptions<CacheKeyType = CacheKey> {
  key: CacheKeyType;
  value: string;
}
