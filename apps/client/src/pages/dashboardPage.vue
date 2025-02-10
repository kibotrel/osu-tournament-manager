<template>
  <div class="m-4">
    <p>Welcome {{ username }} ({{ gameUserId }}). Login: {{ isLoggedIn }}</p>
    <ui-button @mousedown="logout">Logout</ui-button>

    <input
      type="text"
      placeholder="Enter message..."
      v-model="message.content"
      @keydown.enter="
        () => {
          sendMessage(message);
          message.content = '';
        }
      "
      class="my-2 rounded-md border border-gray-300 bg-inherit p-2"
    />
    <div class="mt-2 flex gap-2">
      <ui-button @mousedown="connect">Connect</ui-button>
      <ui-button @mousedown="disconnect">Disconnect</ui-button>
      <ui-button
        @mousedown="
          () => {
            sendMessage(message);
            message.content = '';
          }
        "
        >Send message</ui-button
      >
    </div>
    <div class="my-2">
      <h1>Messages</h1>
      <p v-for="(entry, index) in history" :key="index">
        [{{ formatTimestamp(entry.timestamp) }}] {{ entry.message.author }}:
        {{ entry.message.content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebSocketMessageMatch } from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
  formatTimestamp,
} from '@packages/shared';
import { reactive } from 'vue';

import uiButton from '#src/components/ui/uiButton.vue';
import { useUserStore } from '#src/stores/userStore.js';
import { defineWebsocketStore } from '#src/stores/webSocketStore.js';

const useWebSocketStore = defineWebsocketStore<WebSocketMessageMatch>({
  channel: WebSocketChannel.Matches,
  events: [WebSocketChannelMatchesEvent.ChatMessages],
  threadId: '1',
});
const { gameUserId, username, isLoggedIn, logout } = useUserStore();
const { connect, disconnect, history, sendMessage } = useWebSocketStore();
const message = reactive<WebSocketMessageMatch>({
  content: '',
  author: username,
});
</script>

<style scoped></style>
