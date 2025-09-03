import type { UUID } from 'node:crypto';
import { randomUUID } from 'node:crypto';
import type { Server } from 'node:http';

import type { WebSocketMessage } from '@packages/shared';
import {
  HttpInternalServerError,
  HttpStatusCode,
  HttpStatusMessage,
  WebSocketClosureCode,
  WebSocketClosureReason,
  WebSocketEvent,
} from '@packages/shared';
import type { Request, Response } from 'express';
import type { RawData, WebSocket } from 'ws';
import { WebSocketServer as WSS } from 'ws';

import { environmentConfig } from '#src/configs/environmentConfig.js';
import { HttpEvent } from '#src/constants/httpConstants.js';
import { logger } from '#src/dependencies/loggerDependency.js';
import { session as sessionMiddleware } from '#src/middlewares/sessionMiddleware.js';

/**
 * This trick is needed because augmenting the WebSocket interface through declaration merging
 * is not possible for this library. See [this Github issue](https://github.com/websockets/ws/issues/1517)
 * for more information.
 */
export interface ExtendedWebSocket extends WebSocket {
  id: UUID;
  isAlive: boolean;
  subscriptions: Set<string>;
}

export interface WebSocketServerOptions {
  pingIntervalTime: number;
  pingPayload: number;
  pongPayload: number;
}

export interface WebSocketTopicsSubscription {
  channel: string;
  threadId: string;
  events: string[];
}

/**
 * WebSocket server with request authentication, heartbeat mechanism to detect dead connections, and message broadcasting.
 */
export class WebSocketServer {
  private readonly pingIntervalId: NodeJS.Timeout;
  private readonly pongPayload: number;
  /**
   * Set members are UUIds of cached WebSocket clients.
   */
  private readonly topicsSubscribers: Map<string, Set<UUID>>;
  private readonly webSocketServer: WSS;
  private readonly webSocketClients: Map<UUID, ExtendedWebSocket>;

  constructor(options: WebSocketServerOptions) {
    const { pingIntervalTime, pingPayload, pongPayload } = options;

    this.pongPayload = pongPayload;
    this.webSocketServer = new WSS({ noServer: true, clientTracking: false });
    this.webSocketClients = new Map();
    this.topicsSubscribers = new Map();

    this.pingIntervalId = this.schedulePingInterval({
      interval: pingIntervalTime,
      payload: pingPayload,
    });

    this.handleWebSocketServerCloseEvent();
    this.handleWebSocketServerConnectionEvent();
  }

  private addTopicsSubscription(
    webSocket: ExtendedWebSocket,
    subscription: WebSocketTopicsSubscription,
  ) {
    const { channel = '*', threadId = '*', events } = subscription;

    for (const event of events) {
      const topic = `${channel}:${threadId}:${event}`;

      if (!this.topicsSubscribers.has(topic)) {
        this.topicsSubscribers.set(topic, new Set());
      }

      this.topicsSubscribers.get(topic)!.add(webSocket.id);
      webSocket.subscriptions.add(topic);
    }
  }

  public broadcastMessageToSubscribers(message: RawData, isBinary: boolean) {
    const { topic }: WebSocketMessage = JSON.parse(message.toString());
    const [channel, threadId, event] = topic.split(':');
    const isChannelWideMessage = threadId === '*';
    const threadsToBroadcastTo: string[] = [];

    if (isChannelWideMessage) {
      const anyThreadInChannel = new RegExp(`^${channel}:.+:${event}$`);
      const topics = [...this.topicsSubscribers.keys()].filter((topic) => {
        return anyThreadInChannel.test(topic);
      });

      threadsToBroadcastTo.push(...topics);
    } else {
      threadsToBroadcastTo.push(topic, `${channel}:*:${event}`);
    }

    const allSubscriptions: UUID[] = [];

    for (const thread of threadsToBroadcastTo) {
      const subscribers = this.topicsSubscribers.get(thread);

      if (!subscribers) {
        continue;
      }

      allSubscriptions.push(...subscribers);
    }

    const uniqueWebSocketIds = new Set<UUID>(allSubscriptions);

    for (const webSocketId of uniqueWebSocketIds) {
      const webSocket = this.webSocketClients.get(webSocketId);

      webSocket?.send(message, { binary: isBinary });
    }
  }

  private cacheWebSocketClient(webSocket: ExtendedWebSocket) {
    this.webSocketClients.set(webSocket.id, webSocket);
  }

  /**
   * Gracefully close the WebSocket server and all the connection it holds.
   */
  public async close() {
    await this.webSocketServer.close(() => {
      for (const client of this.webSocketClients.values()) {
        client.close(
          WebSocketClosureCode.GoingAway,
          WebSocketClosureReason.ServerShutdown,
        );
      }
    });
  }

  /**
   * Parse URL used to establish the WebSocket connection to extract key information
   * to help with message broadcasting.
   */
  private extractConnectionIntents(url: string) {
    const { pathname, searchParams } = new URL(url, environmentConfig.baseUrl);
    const [channel, threadId] = pathname.split('/').filter(Boolean).slice(1);
    const events = searchParams.get('events')?.split(',') ?? [];

    return { channel, threadId, events };
  }

  /**
   * Handle HTTP Upgrade requests to WebSocket protocol.
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

  private handleWebSocketCloseEvent(webSocket: ExtendedWebSocket) {
    this.webSocketClients.delete(webSocket.id);

    for (const subscription of webSocket.subscriptions.values()) {
      this.topicsSubscribers.get(subscription)?.delete(webSocket.id);
    }
  }

  private handleWebSocketMessageEvent(
    webSocket: ExtendedWebSocket,
    message: RawData,
    isBinary: boolean,
  ) {
    if (isBinary && (message as Buffer)[0] === this.pongPayload) {
      /* eslint-disable-next-line no-param-reassign */
      webSocket.isAlive = true;

      return;
    }

    this.broadcastMessageToSubscribers(message, isBinary);
  }

  private handleWebSocketServerCloseEvent() {
    this.webSocketServer.on(WebSocketEvent.Close, () => {
      clearInterval(this.pingIntervalId);
    });
  }

  private handleWebSocketServerConnectionEvent() {
    this.webSocketServer.on(WebSocketEvent.Connection, (webSocket, request) => {
      const subscription = this.extractConnectionIntents(request.url!);
      const extendedWebSocket = this.injectCustomWebSocketProperties(webSocket);

      this.cacheWebSocketClient(extendedWebSocket);
      this.addTopicsSubscription(extendedWebSocket, subscription);

      extendedWebSocket.on(WebSocketEvent.Error, (error) => {
        this.logWebSocketPostUpgradeError(extendedWebSocket, error);
      });
      extendedWebSocket.on(WebSocketEvent.Message, (message, isBinary) => {
        this.handleWebSocketMessageEvent(extendedWebSocket, message, isBinary);
      });
      extendedWebSocket.on(WebSocketEvent.Close, () => {
        this.handleWebSocketCloseEvent(extendedWebSocket);
      });
    });
  }

  /**
   * Overload the WebSocket instance with custom properties to help with message broadcasting
   * and connection management.
   */
  private injectCustomWebSocketProperties(webSocket: WebSocket) {
    const extendedWebSocket = webSocket as ExtendedWebSocket;

    extendedWebSocket.id = randomUUID();
    extendedWebSocket.isAlive = true;
    extendedWebSocket.subscriptions = new Set();

    return extendedWebSocket;
  }

  private logWebSocketPostUpgradeError(
    webSocket: ExtendedWebSocket,
    error: Error,
  ) {
    const internalServerError = new HttpInternalServerError({
      message: 'Error occurred while processing websocket message',
      cause: error,
    });

    logger.error(internalServerError.message, {
      error: internalServerError,
      webSocketId: webSocket.id,
    });
  }

  private logWebSocketPreUpgradeError(error: Error) {
    const internalServerError = new HttpInternalServerError({
      message: 'Http request upgrade to websocket protocol failed',
      cause: error,
    });

    logger.error(internalServerError.message, {
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
      for (const websocket of this.webSocketClients.values()) {
        if (!websocket.isAlive) {
          return websocket.close(
            WebSocketClosureCode.GoingAway,
            WebSocketClosureReason.NotResponding,
          );
        }

        websocket.isAlive = false;
        websocket.send(payload, { binary: true });
      }
    }, interval);
  }
}
