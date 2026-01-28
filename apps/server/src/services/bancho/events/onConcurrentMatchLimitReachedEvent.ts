import { logger } from '#src/dependencies/loggerDependency.js';

export const onConcurrentMatchLimitReached = () => {
  logger.warn('[IRC] Concurrent match limit reached');
};
