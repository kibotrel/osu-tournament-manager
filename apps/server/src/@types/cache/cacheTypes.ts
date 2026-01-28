import type {
  CacheListTopic,
  CacheSetTopic,
  CacheStringTopic,
  CacheTopic,
} from '#src/constants/cacheConstants.js';

export type CacheKey = CacheTopic | `${CacheTopic}:${string | number}`;
export type CacheListKey =
  | CacheListTopic
  | `${CacheListTopic}:${string | number}`;
export type CacheSetKey = CacheSetTopic | `${CacheSetTopic}:${string | number}`;
export type CacheStringKey =
  | CacheStringTopic
  | `${CacheStringTopic}:${string | number}`;

export interface AddToCacheOptions<CacheKeyType = CacheKey> {
  key: CacheKeyType;
  value: string;
  expiryInSeconds?: number;
}
