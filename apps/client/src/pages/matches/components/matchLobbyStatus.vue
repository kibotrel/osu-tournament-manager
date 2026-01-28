<template>
  <div class="h-full">
    <div
      class="border-primary-3 mx-4 flex h-full flex-col overflow-hidden rounded-md border-2"
    >
      <div class="border-primary-3 border-b-2 px-4 py-2">
        <div class="flex items-center justify-between">
          <BaseBody variant="base" class="text-primary-2"
            >{{ match.playerCount }} / 16 Players</BaseBody
          >
          <BaseButton
            class="w-32"
            id="refresh-lobby-state"
            variant="primary"
            @keydown.enter="refreshLobbyState"
            @mousedown="refreshLobbyState"
          >
            <template #default> Refresh </template>
            <template #icon>
              <ArrowPathIcon class="text-primary-4 h-6 w-6" />
            </template>
          </BaseButton>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-for="(slot, index) in match.slots" :key="index">
          <div
            :class="[
              'border-primary-4 grid grid-cols-[0.5rem_1fr_1fr_5rem_2em] items-center',
              {
                'border-b-2': index < match.slots.length - 1,
                'border-t-2': index > 0,
                'hover:bg-primary-3/30': slot.player,
              },
            ]"
          >
            <div
              :class="[
                'flex h-full overflow-hidden',
                slot.player ? 'bg-primary-1' : 'bg-primary-3/60',
                { 'rounded-bl-sm': index === match.slots.length - 1 },
              ]"
            >
              <span v-html="'&nbsp'" />
            </div>
            <div class="flex items-center space-x-2">
              <BaseBody class="ml-2 py-2 font-bold!">
                <span v-html="slot.player || '&nbsp;'" />
              </BaseBody>
              <CrownIcon v-show="slot.isHost" class="h-6 w-6 text-yellow-400" />
            </div>
            <div v-show="slot.player">
              <BaseModification
                class="mr-1"
                v-for="(modification, index) in [
                  ...match.globalModifications,
                  ...slot.selectedModifications,
                ]"
                :key="index"
                :mod="modification"
              />
            </div>
            <div class="flex">
              <BaseBadge
                color="green"
                variant="small"
                v-show="slot.isReady === true"
                :icon="{ side: 'right', name: 'check' }"
              >
                Ready
              </BaseBadge>
            </div>
            <div class="flex" v-if="slot.player">
              <BaseDropdown :items="quickActionsForPlayer(slot.player)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WebSocketMatchMessage } from '@packages/shared';
import { BanchoCommand, WebSocketChannelMatchesEvent } from '@packages/shared';
import { storeToRefs } from 'pinia';

import BaseBadge from '#src/components/base/baseBadge.vue';
import BaseBody from '#src/components/base/baseBody.vue';
import BaseButton from '#src/components/base/baseButton.vue';
import type { DropdownItem } from '#src/components/base/baseDropdown.vue';
import BaseDropdown from '#src/components/base/baseDropdown.vue';
import BaseModification from '#src/components/base/baseModification.vue';
import ArrowPathIcon from '#src/components/icons/arrowPathIcon.vue';
import CrownIcon from '#src/components/icons/crownIcon.vue';
import { useMatchStore } from '#src/stores/matchStore.js';
import { useUserStore } from '#src/stores/userStore.js';

interface Properties {
  sendBanchoMessage: (
    message: WebSocketMatchMessage,
    event: WebSocketChannelMatchesEvent,
  ) => void;
}

const { user } = useUserStore();
const { match } = storeToRefs(useMatchStore());
const properties = defineProps<Properties>();

const refreshLobbyState = () => {
  properties.sendBanchoMessage(
    { author: user.name, content: BanchoCommand.GetMatchSettings },
    WebSocketChannelMatchesEvent.ChatMessages,
  );
};

const quickActionsForPlayer = (player: string): DropdownItem[] => {
  return [
    {
      id: 'transfer-host',
      label: 'Host',
      onSelect: () => {
        properties.sendBanchoMessage(
          {
            author: user.name,
            content: `${BanchoCommand.TransferHost} ${player}`,
          },
          WebSocketChannelMatchesEvent.ChatMessages,
        );
      },
    },
    {
      id: 'kick-player',
      label: 'Kick',
      onSelect: () => {
        properties.sendBanchoMessage(
          {
            author: user.name,
            content: `${BanchoCommand.KickPlayer} ${player}`,
          },
          WebSocketChannelMatchesEvent.ChatMessages,
        );
      },
    },
  ];
};
</script>
