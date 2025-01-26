import { LogLevel, Logger } from '@packages/logger';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { postgresClient } from '#src/dependencies/databaseDependency.js';

export const logger = new Logger({
  databaseClient: postgresClient,
  isProductionMode: environmentConfig.isProductionMode,
  level: environmentConfig.isProductionMode ? LogLevel.Info : LogLevel.Debug,
});
