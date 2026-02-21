import { logger } from '#src/dependencies/logger.dependency.js';

export const onConcurrentMatchLimitReachedEvent = () => {
  logger.warn('[IRC] Concurrent match limit reached');
};
