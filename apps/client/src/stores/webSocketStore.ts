/* eslint-disable unicorn/consistent-function-scoping */

import {
  WEBSOCKET_PONG_PAYLOAD,
  WEBSOCKET_PONG_TIMEOUT,
  WebSocketClosureCode,
  WebSocketClosureReason,
  WebSocketEvent,
  isBinaryObject,
  normalizePath,
} from '@packages/shared';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { baseWebSocketUrl } from '#src/api/apiConstants.js';
import type { ExtendedWebSocket } from '#src/types/webSockets.js';

export const useWebSocketStore = defineStore(
  'webSocket',
  () => {
    const messages = ref<unknown[]>([]);
    const socket = ref<ExtendedWebSocket | undefined>(undefined);

    const connect = (options: { endpoint: string }) => {
      if (socket.value) {
        socket.value.close(
          WebSocketClosureCode.Normal,
          WebSocketClosureReason.Reconnecting,
        );

        clearTimeout(socket.value.pongTimeout);
        messages.value.splice(0, messages.value.length);
      }

      const webSocketUrl = new URL(
        normalizePath(`/websockets/${options.endpoint}`),
        baseWebSocketUrl,
      );

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
      messages.value.splice(0, messages.value.length);
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

      messages.value.push(JSON.parse(message.data));
    };

    const onOpenEvent = () => {
      // TODO: Fetch data from server to backfill the messages array.
    };

    const sendMessage = (message: unknown) => {
      if (!socket.value) {
        return;
      }

      socket.value.send(JSON.stringify(message));
    };

    const sendPongMessageToServer = () => {
      if (!socket.value) {
        return;
      }

      clearTimeout(socket.value.pongTimeout);

      socket.value.pongTimeout = setTimeout(() => {
        socket.value!.close(
          WebSocketClosureCode.GoingAway,
          WebSocketClosureReason.NotResponding,
        );
      }, WEBSOCKET_PONG_TIMEOUT);

      socket.value.send(new Uint8Array([WEBSOCKET_PONG_PAYLOAD]));
    };

    return { connect, disconnect, messages, sendMessage, socket };
  },
  { persist: false },
);
