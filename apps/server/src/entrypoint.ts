import { Signal } from '#src/constants/signalConstants.js';
import { createHttpServer, gracefulShutdown } from '#src/httpServer.js';
import { createWebsocketServer } from '#src/websocketServer.js';

const httpServer = createHttpServer();
const webSocketServer = createWebsocketServer(httpServer);

process.on(Signal.Interrupt, () => {
  return gracefulShutdown(httpServer, webSocketServer);
});
process.on(Signal.Terminate, () => {
  return gracefulShutdown(httpServer, webSocketServer);
});
