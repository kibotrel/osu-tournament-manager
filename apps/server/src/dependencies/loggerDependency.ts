import { LogLevel, Logger } from '@packages/logger';

import { environmentConfig } from '#src/configs/environmentConfig.js';

export const logger = new Logger({
  isProductionMode: environmentConfig.isProductionMode,
  level: environmentConfig.isProductionMode ? LogLevel.Info : LogLevel.Debug,
});
