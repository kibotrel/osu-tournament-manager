import { BanchoClient } from '@packages/bancho-client';

import { Signal } from '#src/constants/signalConstants.js';
import { createHttpServer, gracefulShutdown } from '#src/httpServer.js';
import { createWebsocketServer } from '#src/websocketServer.js';

import { environmentConfig } from './configs/environmentConfig.js';

const httpServer = createHttpServer();
const webSocketServer = createWebsocketServer(httpServer);
// TODO: Move this into its dedicated dependency file.
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

banchoClient.connect();

process.on(Signal.Interrupt, () => {
  return gracefulShutdown(httpServer, webSocketServer, banchoClient);
});
process.on(Signal.Terminate, () => {
  return gracefulShutdown(httpServer, webSocketServer, banchoClient);
});
