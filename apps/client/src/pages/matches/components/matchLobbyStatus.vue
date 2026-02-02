<template>
  <div class="h-full">
    <div class="border-primary-3 mx-4 rounded-md border-2">
      <div class="border-primary-3 border-b-2 px-4 py-2">
        <div class="flex items-center justify-between">
          <BaseBody variant="base" class="text-primary-2"
            >{{ match.playerCount }} / 16 Players</BaseBody
          >
          <BaseButton
            id="refresh-lobby-state"
            class="w-32"
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
        <div v-for="(slot, slotIndex) in match.slots" :key="slotIndex">
          <div
            :class="[
              'border-primary-4 grid grid-cols-[0.5rem_1fr_1fr_5rem_2em] items-center',
              {
                'border-b-2': slotIndex < match.slots.length - 1,
                'border-t-2': slotIndex > 0,
                'hover:bg-primary-3/30': slot.player,
              },
            ]"
          >
            <div
              :class="[
                'flex h-full overflow-hidden',
                slot.player ? 'bg-primary-1' : 'bg-primary-3/60',
                { 'rounded-bl-sm': slotIndex === match.slots.length - 1 },
              ]"
            >
              <span>&nbsp;</span>
            </div>
            <div class="flex items-center space-x-2">
              <BaseBody class="ml-2 py-2 font-bold!">
                <span>{{ slot.player || '\u00a0' }}</span>
              </BaseBody>
              <CrownIcon v-show="slot.isHost" class="h-6 w-6 text-yellow-400" />
            </div>
            <div v-show="slot.player">
              <BaseModification
                v-for="(modification, modificationIndex) in [
                  ...match.globalModifications,
                  ...slot.selectedModifications,
                ]"
                :key="modificationIndex"
                class="mr-1"
                :mod="modification"
              />
            </div>
            <div class="flex">
              <BaseBadge
                v-show="slot.isReady === true"
                color="green"
                variant="small"
                :icon="{ side: 'right', name: 'check' }"
              >
                Ready
              </BaseBadge>
            </div>
            <div v-if="slot.player" class="flex">
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
