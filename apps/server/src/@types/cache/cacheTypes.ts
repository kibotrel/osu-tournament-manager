import type { CacheTopic } from '#src/constants/cacheConstants.js';

export type CacheKey = `${CacheTopic}:${string}`;
