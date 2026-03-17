<template>
  <BaseDrawer
    id="match-information-drawer"
    variant="right"
    :is-drawer-open
    @close:drawer="emit('close:drawer')"
  >
    <template #header>
      <div
        class="align-center mx-4 mt-8 flex flex-col md:mx-8 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <BaseHeadline class="">{{ match.name }}</BaseHeadline>
        </div>
        <div v-if="match.historyUrl" class="mt-2 md:mt-0">
          <BaseCaption>
            <BaseLink is-external :link="match.historyUrl">
              {{ $t('pages.match.drawer.linkToOfficialHistory') }}
            </BaseLink>
          </BaseCaption>
        </div>
      </div>
      <BaseTabList
        id="match-drawer-tab-list"
        v-model="tab"
        class="mx-4 mt-8 md:mx-8"
        :tabs="[
          {
            label: $t('pages.match.drawer.tabs.names.status'),
            value: 'status',
            icon: 'signal',
          },
          {
            label: $t('pages.match.drawer.tabs.names.settings'),
            value: 'settings',
            icon: 'gear',
          },
          {
            label: $t('pages.match.drawer.tabs.names.timeline'),
            value: 'timeline',
            icon: 'clock',
          },
          {
            label: $t('pages.match.drawer.tabs.names.commands'),
            value: 'commands',
            icon: 'commandLine',
          },
        ]"
      />
    </template>
    <template #body>
      <div class="flex h-full min-h-0 flex-col pt-4 md:px-4 md:pt-8 md:pb-4">
        <div v-if="tab === 'status'" class="flex min-h-0 flex-col">
          <MatchLobbyStatus :send-bancho-message="sendBanchoMessage" />
        </div>
        <div
          v-else
          class="border-primary-2 flex h-full items-center justify-center rounded-md border-2 border-dashed p-4"
        >
          <BaseBody class="text-primary-2 italic">{{
            $t('global.common.workInProgress')
          }}</BaseBody>
        </div>
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import type {
  WebSocketMatchLobbyState,
  WebSocketMatchMessage,
} from '@packages/shared';
import {
  WebSocketChannel,
  WebSocketChannelMatchesEvent,
} from '@packages/shared';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useGetMatchStateRequest } from '#src/api/matches.api.js';
import BaseBody from '#src/components/base/body.base.vue';
import BaseCaption from '#src/components/base/caption.base.vue';
import BaseDrawer from '#src/components/base/drawer.base.vue';
import BaseHeadline from '#src/components/base/headline.base.vue';
import BaseLink from '#src/components/base/link.base.vue';
import BaseTabList from '#src/components/base/tabList.base.vue';
import { useMatchStore } from '#src/stores/match.store.js';
import { defineWebsocketStore } from '#src/stores/webSocket.store.js';

import MatchLobbyStatus from './matches.lobbyStatus.component.vue';

type Tab = 'commands' | 'settings' | 'status' | 'timeline';

interface Properties {
  isDrawerOpen: boolean;
  sendBanchoMessage: (
    message: WebSocketMatchMessage,
    event: WebSocketChannelMatchesEvent,
  ) => void;
}

const route = useRoute();
const matchId = Number(route.params.gameMatchId);
const { data: lobbyState } = useGetMatchStateRequest(matchId);
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

defineProps<Properties>();

const tab = ref<Tab>('status');
</script>
