<template>
  <div class="border-primary-3 mx-auto mt-4 w-3/4 rounded-md border-2">
    <div
      class="chat-history-container"
      ref="chatHistoryDiv"
      tabindex="-1"
      @scroll="onScroll"
    >
      <div
        v-if="isLoading"
        class="align-center flex h-full flex-col items-center justify-center"
      >
        <LoadingIcon class="h-6" />
      </div>
      <div v-else-if="history.length === 0">
        <BaseBody class="text-primary-2">No message yet.</BaseBody>
      </div>
      <div v-else v-for="(entry, index) in history" :key="entry.timestamp">
        <div :class="detectMarginBetweenMessages(index)">
          <div v-if="shouldDisplayUsername(index)">
            <BaseBody
              isInline
              :class="['font-bold!', usernameColorByRole(entry.message.author)]"
            >
              {{ entry.message.author }}
            </BaseBody>
            <BaseCaption class="text-primary-2 ml-2" isInline>
              {{ new Date(entry.timestamp).toLocaleTimeString() }}
            </BaseCaption>
          </div>
          <BaseBody
            v-if="entry.message.content.startsWith('\x01ACTION')"
            class="whitespace-pre-wrap italic"
          >
            {{ entry.message.content.replace(/^\x01ACTION ?/, '') }}
          </BaseBody>
          <BaseBody v-else class="whitespace-pre-wrap">
            {{ entry.message.content }}
          </BaseBody>
        </div>
      </div>
    </div>
    <div class="border-primary-3 flex flex-row items-center border-t-2">
      <BaseInput
        class="flex-1"
        id="message-input"
        placeholder="Type your message..."
        v-model="refereeMessage.content"
        variant="ghost"
        :isDisabled="!isSocketReady"
        @keydown.enter="sendRefereeMessage"
      />
      <div
        :class="['p-2.5', !isSocketReady ? 'bg-primary-3' : '']"
        @mousedown="sendRefereeMessage"
      >
        <PaperAirplaneIcon
          :class="[
            'h-6 w-6',
            !isSocketReady || !refereeMessage.content
              ? 'text-primary-2 cursor-not-allowed'
              : 'hover:text-primary-1/80 cursor-pointer',
          ]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebSocketMatchMessage } from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
} from '@packages/shared';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useGetMatchChatHistory } from '#src/api/matchesApi.js';
import BaseBody from '#src/components/base/baseBody.vue';
import BaseCaption from '#src/components/base/baseCaption.vue';
import BaseInput from '#src/components/base/baseInput.vue';
import LoadingIcon from '#src/components/icons/loadingIcon.vue';
import PaperAirplaneIcon from '#src/components/icons/paperAirplaneIcon.vue';
import { useScroll } from '#src/composables/useScrollComposable.js';
import { useUserStore } from '#src/stores/userStore.js';
import { defineWebsocketStore } from '#src/stores/webSocketStore.js';

const route = useRoute();
const matchId = Number(route.params.gameMatchId);
const { data: cacheHistory, isLoading } = useGetMatchChatHistory(matchId);
const chatHistoryDiv = ref<HTMLElement | null>(null);
const { isAtBottom, onScroll, scrollToBottom } = useScroll(chatHistoryDiv, {
  isInitiallyAtBottom: true,
});
const { user } = useUserStore();
const useWebSocketStore = defineWebsocketStore<
  WebSocketMatchMessage,
  WebSocketChannel.Matches
>({
  channel: WebSocketChannel.Matches,
  events: [WebSocketChannelMatchesEvent.ChatMessages],
  threadId: matchId.toString(),
});
const { history, isSocketReady } = storeToRefs(useWebSocketStore());
const { sendMessage, setHistory } = useWebSocketStore();
const refereeMessage = reactive<WebSocketMatchMessage>({
  content: '',
  author: user.name,
});

watch(
  history,
  () => {
    if (isAtBottom.value) {
      scrollToBottom();
    }
  },
  { deep: true, immediate: true },
);

watch(cacheHistory, () => {
  if (cacheHistory.value) {
    setHistory(cacheHistory.value.history);
  }
});

const detectMarginBetweenMessages = (index: number) => {
  if (index === 0) {
    return 'mt-0';
  }

  const currentMessage = history.value[index];
  const previousMessage = history.value[index - 1];

  return currentMessage.message.author === previousMessage.message.author
    ? 'mt-0'
    : 'mt-4';
};

const shouldDisplayUsername = (index: number) => {
  if (index === 0) {
    return true;
  }

  const currentMessage = history.value[index];
  const previousMessage = history.value[index - 1];

  return currentMessage.message.author !== previousMessage.message.author;
};

const sendRefereeMessage = () => {
  if (!refereeMessage.content || !isSocketReady.value) {
    return;
  }

  sendMessage(refereeMessage, WebSocketChannelMatchesEvent.ChatMessages);
  refereeMessage.content = '';
};

const usernameColorByRole = (author: string) => {
  if (author === 'BanchoBot') {
    return 'text-pink-400';
  }

  if (author === user.name) {
    return 'text-yellow-400';
  }

  return '';
};
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.chat-history-container {
  @apply h-96 overflow-y-auto p-4;

  scrollbar-width: auto;
  scrollbar-gutter: stable;
  scrollbar-color: oklch(85.2% 0.199 91.936) transparent;
}
</style>
