<template>
  <div class="flex min-h-0 flex-col">
    <div
      class="border-primary-3 mx-4 flex min-h-0 flex-col rounded-md border-2"
    >
      <div class="border-primary-3 shrink-0 border-b-2 px-4 py-2">
        <div class="flex items-center justify-between">
          <BaseBody variant="base" class="text-primary-2">
            {{
              $t('pages.match.drawer.tabs.matchLobbyStatus.playerCount', {
                playerCount: match.playerCount,
              })
            }}
          </BaseBody>
          <BaseButton
            id="refresh-lobby-state"
            class="w-32"
            variant="primary"
            @keydown.enter="refreshLobbyState"
            @mousedown="refreshLobbyState"
          >
            <template #default> {{ $t('global.words.refresh') }} </template>
            <template #icon>
              <ArrowPathIcon class="text-primary-4 h-6 w-6" />
            </template>
          </BaseButton>
        </div>
      </div>
      <div class="min-h-0 overflow-y-auto">
        <div v-for="(slot, slotIndex) in match.slots" :key="slotIndex">
          <div
            :class="[
              'border-primary-4 grid grid-cols-[0.5rem_1fr_auto_auto] items-center gap-x-2 sm:grid-cols-[0.5rem_1fr_1fr_5rem_2em] sm:gap-2',
              {
                'border-b-2': slotIndex < match.slots.length - 1,
                'border-t-2': slotIndex > 0,
                'hover:bg-primary-3/30': slot.player,
              },
            ]"
          >
            <div
              :class="[
                'row-span-2 flex h-full overflow-hidden sm:row-span-1',
                slot.player ? 'bg-primary-1' : 'bg-primary-3/60',
                { 'rounded-bl-sm': slotIndex === match.slots.length - 1 },
              ]"
            >
              <span>&nbsp;</span>
            </div>
            <div
              class="pointer-events-none col-start-2 row-start-1 -ml-2 flex items-center space-x-2 opacity-0 sm:hidden"
              aria-hidden="true"
            >
              <BaseBody class="ml-2 py-2 font-bold!">
                <span>{{ slot.player || '\u00a0' }}</span>
              </BaseBody>
              <CrownIcon v-show="slot.isHost" class="h-6 w-6 text-yellow-400" />
            </div>
            <div
              :class="[
                'col-start-2 row-start-1 -ml-2 flex items-center space-x-2',
                {
                  'row-span-2 sm:row-span-1':
                    match.globalModifications.length === 0 &&
                    slot.selectedModifications.length === 0,
                },
              ]"
            >
              <BaseBody class="ml-2 py-2 font-bold!">
                <span>{{ slot.player || '\u00a0' }}</span>
              </BaseBody>
              <CrownIcon v-show="slot.isHost" class="h-6 w-6 text-yellow-400" />
            </div>
            <div
              class="scrollbar col-start-2 row-start-2 flex min-h-8 overflow-x-scroll sm:col-start-3 sm:row-start-1 sm:min-h-0"
            >
              <template v-if="slot.player">
                <BaseModification
                  v-for="(modification, modificationIndex) in [
                    ...match.globalModifications,
                    ...slot.selectedModifications,
                  ]"
                  :key="modificationIndex"
                  class="not-last:mr-1"
                  :mod="modification"
                />
              </template>
            </div>
            <div
              class="col-start-3 row-span-2 flex justify-end sm:col-start-4 sm:row-span-1 sm:row-start-1"
            >
              <BaseBadge
                v-show="slot.isReady === true"
                color="green"
                variant="small"
                :icon="{ side: 'right', name: 'check' }"
              >
                {{ $t('global.words.ready') }}
              </BaseBadge>
            </div>
            <div
              v-if="slot.player"
              class="col-start-4 row-span-2 flex sm:col-start-5 sm:row-span-1 sm:row-start-1"
            >
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
import { useTranslation } from 'i18next-vue';
import { storeToRefs } from 'pinia';

import BaseBadge from '#src/components/base/badge.base.vue';
import BaseBody from '#src/components/base/body.base.vue';
import BaseButton from '#src/components/base/button.base.vue';
import type { DropdownItem } from '#src/components/base/dropdown.base.vue';
import BaseDropdown from '#src/components/base/dropdown.base.vue';
import BaseModification from '#src/components/base/modification.base.vue';
import ArrowPathIcon from '#src/components/icons/arrowPath.icon.vue';
import CrownIcon from '#src/components/icons/crown.icon.vue';
import { useMatchStore } from '#src/stores/match.store.js';
import { useUserStore } from '#src/stores/user.store.js';

interface Properties {
  sendBanchoMessage: (
    message: WebSocketMatchMessage,
    event: WebSocketChannelMatchesEvent,
  ) => void;
}

const { t } = useTranslation();
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
      label: t(
        'pages.match.drawer.tabs.matchLobbyStatus.dropdown.transferHost',
      ),
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
      label: t('pages.match.drawer.tabs.matchLobbyStatus.dropdown.kick'),
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

<style scoped>
@reference '#src/assets/styles/index.css';

.scrollbar {
  scrollbar-width: auto;
  scrollbar-gutter: stable;
  scrollbar-color: oklch(85.2% 0.199 91.936) transparent;
}
</style>
