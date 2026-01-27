import { banchoClient } from '#src/dependencies/ircClientDependency.js';
import { logger } from '#src/dependencies/loggerDependency.js';

export const onBotDisconnected = async () => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
};
