import { logger } from '#src/dependencies/logger.dependency.js';

export const onConcurrentMatchLimitReached = () => {
  logger.warn('[IRC] Concurrent match limit reached');
};
