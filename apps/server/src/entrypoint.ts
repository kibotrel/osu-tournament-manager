import { Signal } from '#src/constants/signalConstants.js';
import { createHttpServer, gracefulShutdown } from '#src/httpServer.js';
import { joinAllOngoingMatches } from '#src/services/bancho/multiplayerService.js';
import { createWebsocketServer } from '#src/websocketServer.js';

const httpServer = await createHttpServer();

await joinAllOngoingMatches();

const webSocketServer = createWebsocketServer(httpServer);

process.on(Signal.Interrupt, async () => {
  await gracefulShutdown(httpServer, webSocketServer);
});
process.on(Signal.Terminate, async () => {
  await gracefulShutdown(httpServer, webSocketServer);
});
