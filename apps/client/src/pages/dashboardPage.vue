<template>
  <div class="m-4">
    <p>Welcome {{ username }} ({{ gameUserId }}). Login: {{ isLoggedIn }}</p>
    <ui-button @mousedown="logout">Logout</ui-button>

    <input
      type="text"
      placeholder="Enter message..."
      v-model="toSendMessage"
      @keydown.enter="
        () => {
          sendMessage(toSendMessage);
          toSendMessage = '';
        }
      "
      class="my-2 rounded-md border border-gray-300 bg-inherit p-2"
    />
    <div class="mt-2 flex gap-2">
      <ui-button @mousedown="connect({ endpoint: '/matches/1' })"
        >Connect</ui-button
      >
      <ui-button @mousedown="disconnect">Disconnect</ui-button>
      <ui-button @mousedown="sendMessage(toSendMessage)"
        >Send message</ui-button
      >
    </div>
    <div class="my-2">
      <h1>Messages</h1>
      <p v-for="(message, index) in messages" :key="index">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import uiButton from '#src/components/ui/uiButton.vue';
import { useUserStore } from '#src/stores/userStore.js';
import { useWebSocketStore } from '#src/stores/webSocketStore.js';

const { gameUserId, username, isLoggedIn, logout } = useUserStore();
const { connect, disconnect, messages, sendMessage } = useWebSocketStore();

const toSendMessage = ref<string>('');
</script>

<style scoped></style>
