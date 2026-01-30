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
        @keydown.enter="startMatchPoint"
        @mousedown="startMatchPoint"
      >
        Start
      </BaseButton>
      <BaseButton
        id="show-close-match-modal-button"
        class="w-48"
        variant="danger"
        @keydown.enter="isModalOpen = true"
        @mousedown="isModalOpen = true"
      >
        Close Match
      </BaseButton>
      <BaseButton
        id="show-match-information-drawer-button"
        class="w-48"
        @keydown.enter="isMatchInformationDrawerOpen = true"
        @mousedown="isMatchInformationDrawerOpen = true"
      >
        Match information
      </BaseButton>
    </div>
    <MatchCloseModal
      :is-modal-open
      :match-id="match.gameMatchId"
      :match-name="match.name"
      @close:match="redirectToMatchCreationPage"
      @close:modal="isModalOpen = false"
    />
    <MatchDrawer
      id="match-information-drawer"
      :is-drawer-open="isMatchInformationDrawerOpen"
      :send-bancho-message="sendMessage"
      @close:drawer="isMatchInformationDrawerOpen = false"
    />
  </div>
</template>
<script setup lang="ts">
import type { WebSocketMatchMessage } from '@packages/shared';
import {
  BanchoCommand,
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
    { author: user.name, content: `${BanchoCommand.StartMatch} 5` },
    WebSocketChannelMatchesEvent.ChatMessages,
  );
};

const redirectToMatchCreationPage = async () => {
  disconnect();
  await nextTick();

  router?.push(`/matches/create`);
};
</script>
