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
    <BaseBody>Match not found.</BaseBody>
  </div>
  <div v-else>
    <div class="my-4 flex justify-center">
      <BaseHeadline>Match {{ match.gameMatchId }}</BaseHeadline>
    </div>
    <MatchChatHistory />
    <div
      class="align-center mt-4 flex flex-col items-center justify-center gap-y-4"
    >
      <BaseButton
        id="start-match-point-button"
        class="w-48"
        variant="success"
        @mousedown="startMatchPoint"
        @keydown.enter="startMatchPoint"
      >
        Start
      </BaseButton>
      <BaseButton
        id="show-close-match-modal-button"
        class="w-48"
        variant="danger"
        @mousedown="isModalOpen = true"
        @keydown.enter="isModalOpen = true"
      >
        Close Match
      </BaseButton>
      <BaseButton
        id="show-match-information-drawer-button"
        class="w-48"
        @mousedown="isMatchInformationDrawerOpen = true"
        @keydown.enter="isMatchInformationDrawerOpen = true"
      >
        Match information
      </BaseButton>
    </div>
    <MatchCloseModal
      :isModalOpen="isModalOpen"
      :matchId="match.gameMatchId"
      :matchName="match.name"
      @close:modal="isModalOpen = false"
      @close:match="redirectToMatchCreationPage"
    />
    <MatchDrawer
      id="match-information-drawer"
      matchName="MWC4K2025 - RO32: Philippines VS France"
      :isDrawerOpen="isMatchInformationDrawerOpen"
      @close:drawer="isMatchInformationDrawerOpen = false"
    />
  </div>
</template>
<script setup lang="ts">
import type { WebSocketMatchMessage } from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
} from '@packages/shared';
import { inject, nextTick, ref, watch } from 'vue';
import type { Router } from 'vue-router';
import { useRoute } from 'vue-router';

import { useGetMatch } from '#src/api/matchesApi.js';
import BaseBody from '#src/components/base/baseBody.vue';
import BaseButton from '#src/components/base/baseButton.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import LoadingIcon from '#src/components/icons/loadingIcon.vue';
import { useUserStore } from '#src/stores/userStore.js';
import { defineWebsocketStore } from '#src/stores/webSocketStore.js';

import MatchChatHistory from './components/matchChatHistory.vue';
import MatchCloseModal from './components/matchCloseModal.vue';
import MatchDrawer from './components/matchDrawer.vue';

const route = useRoute();
const router = inject<Router>('$router');
const matchId = Number(route.params.gameMatchId);
const isModalOpen = ref(false);
const isMatchInformationDrawerOpen = ref(false);
const { data: match, isLoading: isMatchLoading } = useGetMatch(matchId);
const { user } = useUserStore();
const useWebSocketStore = defineWebsocketStore<
  WebSocketMatchMessage,
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

const startMatchPoint = () => {
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
