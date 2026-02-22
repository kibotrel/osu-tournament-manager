import { banchoClient } from '#src/dependencies/ircClient.dependency.js';
import { logger } from '#src/dependencies/logger.dependency.js';

export const onBotDisconnectedEvent = async () => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
};
