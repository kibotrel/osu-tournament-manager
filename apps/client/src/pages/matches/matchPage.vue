<template>
  <div
    v-if="isMatchLoading"
    class="fixed inset-0 flex items-center justify-center"
  >
    <LoadingIcon />
  </div>
  <div
    v-else-if="!match || match.endsAt"
    class="flex min-h-screen items-center justify-center"
  >
    <p>Match not found.</p>
  </div>
  <div v-else>
    <div class="my-4 flex justify-center">
      <h1 class="">Match {{ match.gameMatchId }}</h1>
    </div>
    <MatchChatHistory />
    <div class="align-center mt-4 flex justify-center space-x-4">
      <BaseButton
        id="start-match-point-button"
        class="w-32"
        variant="success"
        @mousedown="startMatchPoint"
        @keydown.enter="startMatchPoint"
      >
        Start
      </BaseButton>
      <BaseButton
        id="show-close-match-modal-button"
        class="w-32"
        variant="danger"
        @mousedown="isModalOpen = true"
        @keydown.enter="isModalOpen = true"
      >
        Close Match
      </BaseButton>
    </div>
    <MatchCloseModal
      :isModalOpen="isModalOpen"
      :matchId="match.gameMatchId"
      :matchName="match.name"
      @close:modal="isModalOpen = false"
      @close:match="redirectToMatchCreationPage"
    />
  </div>
</template>
<script setup lang="ts">
import type { WebSocketMessageMatch } from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
} from '@packages/shared';
import { inject, nextTick, ref, watch } from 'vue';
import type { Router } from 'vue-router';
import { useRoute } from 'vue-router';

import { useGetMatch } from '#src/api/matchesApi.js';
import BaseButton from '#src/components/base/baseButton.vue';
import LoadingIcon from '#src/components/icons/loadingIcon.vue';
import { useUserStore } from '#src/stores/userStore.js';
import { defineWebsocketStore } from '#src/stores/webSocketStore.js';

import MatchChatHistory from './components/matchChatHistory.vue';
import MatchCloseModal from './components/matchCloseModal.vue';

const route = useRoute();
const router = inject<Router>('$router');
const matchId = Number(route.params.gameMatchId);
const isModalOpen = ref(false);
const { data: match, isLoading: isMatchLoading } = useGetMatch(matchId);
const { user } = useUserStore();
const useWebSocketStore = defineWebsocketStore<
  WebSocketMessageMatch,
  WebSocketChannel.Matches
>({
  channel: WebSocketChannel.Matches,
  events: [WebSocketChannelMatchesEvent.ChatMessages],
  threadId: matchId.toString(),
});
const { connect, disconnect, sendMessage } = useWebSocketStore();

watch(match, (newState, previousState) => {
  if (!previousState && newState?.endsAt === null) {
    connect();
  }
});

const startMatchPoint = async () => {
  sendMessage(
    { author: user.name, content: '!mp start 5' },
    WebSocketChannelMatchesEvent.ChatMessages,
  );
};

const redirectToMatchCreationPage = async () => {
  disconnect();
  await nextTick();

  router?.push(`/matches/create`);
};
</script>
