/* eslint-disable unicorn/consistent-function-scoping */

import type {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  WebSocketMessage,
} from '@packages/shared';
import {
  WEBSOCKET_PONG_PAYLOAD,
  WEBSOCKET_PONG_TIMEOUT,
  WebSocketClosureCode,
  WebSocketClosureReason,
  WebSocketEvent,
  formatList,
  isBinaryObject,
} from '@packages/shared';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { baseWebSocketUrl } from '#src/api/apiConstants.js';
import type { ExtendedWebSocket } from '#src/types/webSockets.js';

type WebSocketStoreOptions = { threadId?: string } & {
  channel: WebSocketChannel.Matches;
  events: WebSocketChannelMatchesEvent[];
};

/**
 * Reason behind this way of defining the store is that user could have
 * multiple tabs opened on different pages that require a WebSocket connection
 * to operate. This way, we can have a unique store for each of them
 */
export const defineWebsocketStore = <MessageType>(
  options: WebSocketStoreOptions,
) => {
  const { channel, threadId, events } = options;
  /**
   * Since user could be in multiple threads at the same time, we need to create a unique store name
   * for each thread to avoid conflicts.
   */
  const urnParts = ['websockets', channel];

  if (threadId) {
    urnParts.push(threadId);
  }

  const storeName = formatList(urnParts, {
    removeEmpty: true,
    separator: ':',
  });

  return defineStore(storeName, () => {
    const history = ref<Array<WebSocketMessage<MessageType>>>([]);
    const socket = ref<ExtendedWebSocket | undefined>(undefined);

    const connect = () => {
      if (socket.value) {
        socket.value.close(
          WebSocketClosureCode.Normal,
          WebSocketClosureReason.Reconnecting,
        );

        clearTimeout(socket.value.pongTimeout);
        history.value.splice(0, history.value.length);
      }

      const endpoint = formatList(urnParts, {
        removeEmpty: true,
        separator: '/',
      });
      const webSocketUrl = new URL(endpoint, baseWebSocketUrl);

      webSocketUrl.searchParams.append('events', events.join(','));

      socket.value = new WebSocket(webSocketUrl);
      socket.value.addEventListener(WebSocketEvent.Close, onCloseEvent);
      socket.value.addEventListener(WebSocketEvent.Error, onErrorEvent);
      socket.value.addEventListener(WebSocketEvent.Message, onMessageEvent);
      socket.value.addEventListener(WebSocketEvent.Open, onOpenEvent);
    };

    const disconnect = () => {
      if (!socket.value) {
        return;
      }

      socket.value.close(
        WebSocketClosureCode.Normal,
        WebSocketClosureReason.FinishedCommunicating,
      );

      clearTimeout(socket.value.pongTimeout);
      history.value.splice(0, history.value.length);
      socket.value = undefined;
    };

    const onCloseEvent = () => {
      return () => {
        clearTimeout(socket.value?.pongTimeout);
        socket.value = undefined;
      };
    };

    const onErrorEvent = () => {
      // TODO: Show a message to the user in a toast for example.
    };

    const onMessageEvent = (message: MessageEvent<string | Blob>) => {
      if (isBinaryObject(message.data)) {
        return sendPongMessageToServer();
      }

      history.value.push(JSON.parse(message.data));
    };

    const onOpenEvent = () => {
      // TODO: Fetch data from server to backfill the messages array.
    };

    const sendMessage = (message: MessageType) => {
      if (!socket.value) {
        return;
      }

      const payload: WebSocketMessage<MessageType> = {
        message,
        timestamp: Date.now(),
      };

      socket.value.send(JSON.stringify(payload));
    };

    const sendPongMessageToServer = () => {
      if (!socket.value) {
        return;
      }

      clearTimeout(socket.value.pongTimeout);

      socket.value.pongTimeout = setTimeout(() => {
        socket.value!.close(
          WebSocketClosureCode.ServerIssue,
          WebSocketClosureReason.NotResponding,
        );
      }, WEBSOCKET_PONG_TIMEOUT);

      socket.value.send(new Uint8Array([WEBSOCKET_PONG_PAYLOAD]));
    };

    return { connect, disconnect, history, sendMessage, socket };
  });
};
