import { type Server } from 'node:http';

import { HttpInternalServerError } from '@packages/shared';
import type WebSocket from 'ws';
import { WebSocketServer } from 'ws';

import { HttpEvent } from '#src/constants/httpConstants.js';
import {
  WebSocketEvent,
  WebSocketState,
} from '#src/constants/webSocketConstants.js';
import { logger } from '#src/dependencies/loggerDependency.js';

const logSocketPreUpgradeError = (error: Error) => {
  const internalServerError = new HttpInternalServerError({
    message: 'Http request upgrade to websocket protocol failed',
    cause: error,
  });

  logger.error(internalServerError.message, { error: internalServerError });
};

const logSocketPostUpgradeError = (error: Error) => {
  const internalServerError = new HttpInternalServerError({
    message: 'Error occurred while processing websocket message',
    cause: error,
  });

  logger.error(internalServerError.message, { error: internalServerError });
};

const handleHttpRequestUpgrade = (
  httpServer: Server,
  webSocketServer: WebSocket.Server,
) => {
  httpServer.on(HttpEvent.Upgrade, (request, socket, head) => {
    socket.on(WebSocketEvent.Error, logSocketPreUpgradeError);

    // TODO: Implement authentication logic here. For now, we accept all upgrade requests.

    webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
      socket.removeListener(WebSocketEvent.Error, logSocketPreUpgradeError);
      webSocketServer.emit(WebSocketEvent.Connection, webSocket, request);
    });
  });
};

export const createWebsocketServer = (httpServer: Server) => {
  const webSocketServer = new WebSocketServer({ noServer: true });

  handleHttpRequestUpgrade(httpServer, webSocketServer);

  const broadcastWebSocketMessage = (
    message: WebSocket.RawData,
    isBinary: boolean,
  ) => {
    for (const client of webSocketServer.clients) {
      if (client.readyState === WebSocketState.Open) {
        client.send(message, { binary: isBinary });
      }
    }
  };

  webSocketServer.on(WebSocketEvent.Connection, (webSocket) => {
    webSocket.on(WebSocketEvent.Error, logSocketPostUpgradeError);
    webSocket.on(WebSocketEvent.Message, broadcastWebSocketMessage);
  });

  return webSocketServer;
};
