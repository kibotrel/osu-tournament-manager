import type { RedisClientType } from 'redis';
import { createClient } from 'redis';

import { cacheConfig } from '#src/configs/cacheConfig.js';

const cache: RedisClientType = createClient({
  url: `redis://default:${cacheConfig.password}@${cacheConfig.host}:${cacheConfig.port}`,
});

cache.on('error', (error) => {
  console.error(error);
});

await cache.connect();

export { cache };
