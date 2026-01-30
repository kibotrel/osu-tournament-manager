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
  exponentialBackoffDelay,
  formatList,
  isBinaryObject,
  sleep,
} from '@packages/shared';
import { defineStore } from 'pinia';
import type { UnwrapRef } from 'vue';
import { ref } from 'vue';

import { baseWebSocketUrl } from '#src/api/apiConstants.js';
import type { ExtendedWebSocket } from '#src/types/webSockets.js';

interface WebSocketChannelEventsMap {
  [WebSocketChannel.Matches]: WebSocketChannelMatchesEvent;
}

interface WebSocketStoreOptions<
  Channel extends keyof WebSocketChannelEventsMap,
> {
  channel: Channel;
  events: Array<WebSocketChannelEventsMap[Channel]>;
  keepHistory?: boolean;
  threadId?: string;
}

/**
 * Reason behind this way of defining the store is that user could have
 * multiple tabs opened on different pages that require a WebSocket connection
 * to operate. This way, we can have a unique store for each of them
 */
export const defineWebsocketStore = <
  MessageType,
  ChannelType extends keyof WebSocketChannelEventsMap,
>(
  options: WebSocketStoreOptions<ChannelType>,
) => {
  const { channel, events, keepHistory = true, threadId } = options;
  /**
   * Since user could be in multiple threads at the same time, we need to create a unique store name
   * for each thread to avoid conflicts.
   */
  const urnParts = ['api', 'websockets', channel];

  if (threadId) {
    urnParts.push(threadId);
  }

  const storeName = formatList([...urnParts, events.join('+')], {
    removeEmpty: true,
    separator: ':',
  });

  return defineStore(storeName, () => {
    const lastMessage = ref<WebSocketMessage<MessageType> | null>(null);
    const history = ref<Array<WebSocketMessage<MessageType>>>([]);
    const isRetryingConnection = ref(false);
    const isSocketReady = ref(false);
    const socket = ref<ExtendedWebSocket | undefined>(undefined);

    const connect = () => {
      if (socket.value) {
        socket.value.close(
          WebSocketClosureCode.Normal,
          WebSocketClosureReason.Reconnecting,
        );
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
    };

    const onCloseEvent = async (event: CloseEvent) => {
      clearTimeout(socket.value?.pongTimeout);
      isSocketReady.value = false;
      socket.value = undefined;

      if (
        [
          WebSocketClosureReason.NotResponding,
          WebSocketClosureReason.ServerShutdown,
        ].includes(event.reason as WebSocketClosureReason)
      ) {
        // TODO: Show a message to the user indicating that websocket connection was lost and that we're attempting to re-establish it.
        isRetryingConnection.value = true;

        for (let attempt = 0; attempt < 5; attempt++) {
          connect();
          await sleep(exponentialBackoffDelay({ attempt }));

          if (isSocketReady.value) {
            break;
          }
        }

        isRetryingConnection.value = false;
        // TODO: Show a message to the user indicating that websocket connection couldn't be re-established.
      }
    };

    const onErrorEvent = () => {
      if (!isSocketReady.value) {
        socket.value = undefined;
      }
      // TODO: Show a message to the user in a toast for example.
    };

    const onMessageEvent = (message: MessageEvent<string | Blob>) => {
      if (isBinaryObject(message.data)) {
        return sendPongMessageToServer();
      }

      const parsedMessage = JSON.parse(message.data);

      if (keepHistory) {
        history.value.push(parsedMessage);
      }

      lastMessage.value = parsedMessage;
    };

    const onOpenEvent = () => {
      if (isRetryingConnection.value) {
        isRetryingConnection.value = false;
        // TODO: Show a message to the user indicating that connection was re-established.
      }

      isSocketReady.value = true;
    };

    const sendMessage = (
      message: MessageType,
      event: WebSocketChannelEventsMap[ChannelType],
    ) => {
      if (!socket.value) {
        return;
      }

      const payload: WebSocketMessage<MessageType> = {
        message,
        topic: `${channel}:${threadId ?? '*'}:${event}`,
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
        socket.value?.close(
          WebSocketClosureCode.ServerIssue,
          WebSocketClosureReason.NotResponding,
        );
      }, WEBSOCKET_PONG_TIMEOUT);

      socket.value.send(new Uint8Array([WEBSOCKET_PONG_PAYLOAD]));
    };

    const setHistory = (
      newHistory: Array<WebSocketMessage<UnwrapRef<MessageType>>>,
    ) => {
      history.value.splice(0, history.value.length, ...newHistory);
    };

    return {
      connect,
      disconnect,
      history,
      isSocketReady,
      lastMessage,
      sendMessage,
      setHistory,
    };
  });
};
