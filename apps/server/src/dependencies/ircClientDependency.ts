import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { removeMatchFromCachedSet } from '#src/services/cache/cacheService.js';

const banchoClient = new BanchoClient({
  clientCredentials: {
    username: environmentConfig.osuIrcClientUsername,
    password: environmentConfig.osuIrcClientPassword,
  },
  serverInformation: {
    host: environmentConfig.osuIrcServerHostname,
    port: environmentConfig.osuIrcServerPort,
  },
});

banchoClient.on(BanchoClientEvent.BotConnected, () => {
  logger.debug('[IRC] Connected to the osu! server.');
});

banchoClient.on(BanchoClientEvent.BotDisconnected, async () => {
  logger.debug('[IRC] Disconnected from osu! server');

  await banchoClient.connect();
});

banchoClient.on(BanchoClientEvent.BotJoinedChannel, ({ channel }) => {
  logger.debug(`[IRC] Joined ${channel}.`);
});

banchoClient.on(
  BanchoClientEvent.MultiplayerChannelClosed,
  async ({ channel }) => {
    logger.debug(`[IRC] Match ${channel} closed.`);

    await removeMatchFromCachedSet(channel);
  },
);

export { banchoClient };
