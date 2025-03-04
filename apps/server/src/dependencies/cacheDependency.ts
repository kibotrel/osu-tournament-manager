import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

import { cacheConfig } from '#src/configs/cacheConfig.js';
import { CacheEvent } from '#src/constants/cacheConstants.js';
import { logger } from '#src/dependencies/loggerDependency.js';

const cache: RedisClientType = createClient({
  url: `redis://default:${cacheConfig.password}@${cacheConfig.host}:${cacheConfig.port}`,
});

cache.on(CacheEvent.Error, (error) => {
  logger.error('[Redis] Something went wrong!', { error });
});

await cache.connect();

export { cache };
