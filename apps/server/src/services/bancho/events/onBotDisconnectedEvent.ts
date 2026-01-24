import type { BanchoClient } from '@packages/bancho-client';

import { logger } from '#src/dependencies/loggerDependency.js';

export const onBotDisconnected = async (banchoClient: BanchoClient) => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
};
