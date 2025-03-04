import { BanchoClient, BanchoClientEvent } from '@packages/bancho-client';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { logger } from '#src/dependencies/loggerDependency.js';

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
  logger.debug('Connected to the osu! IRC server.');
});

export { banchoClient };
