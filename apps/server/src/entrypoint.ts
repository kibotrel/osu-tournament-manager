import { Signals } from '#src/constants/signalConstants.js';
import { createHttpServer, gracefulShutdown } from '#src/server.js';

const server = createHttpServer();

process.on(Signals.SIGINT, () => {
  return gracefulShutdown(server);
});
process.on(Signals.SIGTERM, () => {
  return gracefulShutdown(server);
});
