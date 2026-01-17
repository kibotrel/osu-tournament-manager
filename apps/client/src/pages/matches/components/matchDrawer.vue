<template>
  <BaseDrawer
    id="match-information-drawer"
    variant="right"
    :isDrawerOpen="properties.isDrawerOpen"
    @close:drawer="emit('close:drawer')"
  >
    <template #header>
      <div
        class="align-center mx-8 mt-8 flex flex-row items-center justify-between"
      >
        <div>
          <BaseHeadline class="">{{ match.name }}</BaseHeadline>
        </div>
        <div v-if="match.historyUrl">
          <BaseBody>
            <BaseLink isExternal :link="match.historyUrl">
              Official match page
            </BaseLink>
          </BaseBody>
        </div>
      </div>
      <BaseTabList
        class="mx-8 mt-8"
        id="match-drawer-tab-list"
        :tabs="[
          { label: 'Status', value: 'status', icon: 'signal' },
          { label: 'Settings', value: 'settings', icon: 'gear' },
          { label: 'Timeline', value: 'timeline', icon: 'clock' },
          {
            label: 'Commands',
            value: 'commands',
            icon: 'commandLine',
          },
        ]"
        v-model="tab"
      />
    </template>
    <template #body>
      <div class="h-full p-4">
        <div v-if="tab === 'status'" class="h-full">
          <MatchLobbyStatus />
        </div>
        <div
          v-else
          class="border-primary-2 flex h-full items-center justify-center rounded-md border-2 border-dashed p-4"
        >
          <BaseBody class="text-primary-2 italic">Work in progress</BaseBody>
        </div>
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import type { WebSocketMatchLobbyState } from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
} from '@packages/shared';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useGetMatchState } from '#src/api/matchesApi.js';
import BaseBody from '#src/components/base/baseBody.vue';
import BaseDrawer from '#src/components/base/baseDrawer.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseLink from '#src/components/base/baseLink.vue';
import BaseTabList from '#src/components/base/baseTabList.vue';
import { useMatchStore } from '#src/stores/matchStore.js';
import { defineWebsocketStore } from '#src/stores/webSocketStore.js';

import MatchLobbyStatus from './matchLobbyStatus.vue';

type Tab = 'commands' | 'settings' | 'status' | 'timeline';

interface Properties {
  isDrawerOpen: boolean;
  matchName: string;
}

const route = useRoute();
const matchId = Number(route.params.gameMatchId);
const { data: lobbyState } = useGetMatchState(matchId);
const { match } = storeToRefs(useMatchStore());
const { setMatch } = useMatchStore();
const useWebSocketStore = defineWebsocketStore<
  WebSocketMatchLobbyState,
  WebSocketChannel.Matches
>({
  channel: WebSocketChannel.Matches,
  events: [WebSocketChannelMatchesEvent.LobbyState],
  keepHistory: false,
  threadId: matchId.toString(),
});
const webSocketStore = useWebSocketStore();
const { connect } = webSocketStore;
const { lastMessage } = storeToRefs(webSocketStore);

connect();

watch(lobbyState, (newLobbyState) => {
  if (newLobbyState) {
    setMatch(newLobbyState.state);
  }
});

watch(lastMessage, (newMessage) => {
  if (newMessage) {
    setMatch(newMessage.message);
  }
});

const emit = defineEmits(['close:drawer']);
const properties = defineProps<Properties>();
const tab = ref<Tab>('status');
</script>
