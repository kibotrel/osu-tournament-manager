import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';

import type { Logger } from '@packages/logger';
import {
  HttpInternalServerError,
  HttpStatusCode,
  HttpStatusMessage,
} from '@packages/shared';
import type { Request, Response } from 'express';
import type { RawData, WebSocket } from 'ws';
import { WebSocketServer as WSS } from 'ws';

import { HttpEvent } from '#src/constants/httpConstants.js';
import {
  WebSocketEvent,
  WebSocketState,
} from '#src/constants/webSocketConstants.js';
import { session as sessionMiddleware } from '#src/middlewares/sessionMiddleware.js';

/**
 * This trick is needed because augmenting the WebSocket interface through declaration merging
 * is not possible for this library. See [this Github issue](https://github.com/websockets/ws/issues/1517)
 * for more information.
 */
export interface ExtendedWebSocket extends WebSocket {
  id: string;
  isAlive: boolean;
}

export interface WebSocketServerOptions {
  pingIntervalTime: number;
  pingPayload: number;
  pongPayload: number;
  logger: Logger;
}

/**
 * WebSocket server with request authentication, heartbeat mechanism to detect dead connections, and message broadcasting.
 */
export class WebSocketServer {
  private readonly logger: Logger;
  private readonly pingIntervalId: NodeJS.Timeout;
  private readonly pongPayload: number;
  private readonly webSocketServer: WSS;

  constructor(options: WebSocketServerOptions) {
    const { logger, pingIntervalTime, pingPayload, pongPayload } = options;

    this.logger = logger;
    this.pongPayload = pongPayload;
    this.webSocketServer = new WSS({ noServer: true });

    this.pingIntervalId = this.schedulePingInterval({
      interval: pingIntervalTime,
      payload: pingPayload,
    });

    this.handleWebSocketServerCloseEvent();
    this.handleWebSocketServerConnectionEvent();
  }

  /**
   * Gracefully close the WebSocket server and all the connection it holds.
   */
  public async close() {
    await this.logger.debug('closing websocket server...');

    for (const client of this.webSocketServer.clients) {
      client.close();
    }

    await this.webSocketServer.close();
  }

  /**
   * Handle HTTP Upgrade requsts to WebSocket protocol.
   */
  public handleHttpRequestUpgradeEvent(httpServer: Server) {
    httpServer.on(HttpEvent.Upgrade, (request, socket, head) => {
      socket.on(WebSocketEvent.Error, this.logWebSocketPreUpgradeError);

      /**
       * Arbitrarily use the session middleware to authenticate the user because
       * this step is normally handled by the express middleware chain but in this
       * case we are not hitting the express application.
       */
      sessionMiddleware(request as Request, {} as Response, () => {
        const { session } = request as Request;

        if (!session?.user) {
          socket.write(
            `HTTP/${request.httpVersion} ${HttpStatusCode.Unauthorized} ${HttpStatusMessage.Unauthorized}\r\n\r\n`,
          );

          return socket.destroy();
        }

        this.webSocketServer.handleUpgrade(
          request,
          socket,
          head,
          (webSocket) => {
            socket.removeListener(
              WebSocketEvent.Error,
              this.logWebSocketPreUpgradeError,
            );
            this.webSocketServer.emit(
              WebSocketEvent.Connection,
              webSocket,
              request,
            );
          },
        );
      });
    });
  }

  private handleWebSocketServerCloseEvent() {
    this.webSocketServer.on(WebSocketEvent.Close, () => {
      clearInterval(this.pingIntervalId);
    });
  }

  private async handleWebSocketMessageEvent(
    this: { webSocket: ExtendedWebSocket; webSocketServer: WebSocketServer },
    message: RawData,
    isBinary: boolean,
  ) {
    const {
      webSocket,
      webSocketServer: { logger, pongPayload, webSocketServer },
    } = this;

    if (isBinary && (message as Buffer)[0] === pongPayload) {
      await logger.debug(`Received pong from client ${this.webSocket.id}.`);
      webSocket.isAlive = true;

      return;
    }

    // TODO: Implement a better message broadcasting mechanism taking with topics that clients can subscribe to based on URL path used to establish the websocket connection.

    for (const client of webSocketServer.clients) {
      if (client.readyState === WebSocketState.Open) {
        client.send(message, { binary: isBinary });
      }
    }
  }

  private handleWebSocketServerConnectionEvent() {
    this.webSocketServer.on(WebSocketEvent.Connection, (webSocket) => {
      const extendedWebSocket = webSocket as ExtendedWebSocket;

      extendedWebSocket.id = randomUUID();
      extendedWebSocket.isAlive = true;

      extendedWebSocket.on(
        WebSocketEvent.Error,
        this.logWebSocketPostUpgradeError.bind({
          webSocket: extendedWebSocket,
          logger: this.logger,
        }),
      );
      extendedWebSocket.on(
        WebSocketEvent.Message,
        this.handleWebSocketMessageEvent.bind({
          webSocket: extendedWebSocket,
          webSocketServer: this,
        }),
      );
    });
  }

  private async logWebSocketPostUpgradeError(
    this: { logger: Logger; webSocket: ExtendedWebSocket },
    error: Error,
  ) {
    const internalServerError = new HttpInternalServerError({
      message: 'Error occurred while processing websocket message',
      cause: error,
    });

    await this.logger.error(internalServerError.message, {
      error: internalServerError,
      webSocketId: this.webSocket.id,
    });
  }

  private async logWebSocketPreUpgradeError(error: Error) {
    const internalServerError = new HttpInternalServerError({
      message: 'Http request upgrade to websocket protocol failed',
      cause: error,
    });

    await this.logger.error(internalServerError.message, {
      error: internalServerError,
    });
  }

  /**
   * Schedule a ping message on a specific interval to keep the connections alive
   * and terminate the ones that are not to avoid sending messages to dead connections.
   */
  private schedulePingInterval(options: { interval: number; payload: number }) {
    const { interval, payload } = options;

    return setInterval(() => {
      for (const client of this.webSocketServer.clients) {
        const extendedWebSocket = client as ExtendedWebSocket;

        if (!extendedWebSocket.isAlive) {
          return client.terminate();
        }

        extendedWebSocket.isAlive = false;
        extendedWebSocket.send(payload, { binary: true });
      }
    }, interval);
  }
}
