<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">Modals</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton
          class="w-32"
          id="base-modal"
          @keydown.enter="isModalOpen = true"
          @mousedown="isModalOpen = true"
        >
          Base
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Drawers</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton
          class="w-32"
          id="open-bottom-drawer"
          @keydown.enter="isBottomDrawerOpen = true"
          @mousedown="isBottomDrawerOpen = true"
        >
          Bottom
        </BaseButton>
        <BaseButton
          class="w-32"
          id="open-right-drawer"
          @keydown.enter="isRightDrawerOpen = true"
          @mousedown="isRightDrawerOpen = true"
        >
          Right
        </BaseButton>
        <div>
          <BaseButton
            class="w-32"
            id="temporary-drawer"
            @keydown.enter="temporary = true"
            @mousedown="temporary = true"
          >
            Temporary
          </BaseButton>
          <MatchDrawer
            id="match-information-drawer"
            matchName="MWC4K2025 - RO32: Philippines VS France"
            :isDrawerOpen="temporary"
            @close:drawer="temporary = false"
          />
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Tab Lists</BaseHeadline>
      <div class="w-96 space-y-4">
        <BaseTabList
          id="base-tab-list"
          :tabs="[
            { label: 'Base', value: 'tab1' },
            { label: 'Tab', value: 'tab2' },
            { label: 'List', value: 'tab3' },
          ]"
          v-model="selectedTab"
        />
        <BaseTabList
          id="base-tab-list-with-icons"
          :tabs="[
            { icon: 'cubeTransparent', label: 'Tabs', value: 'tab1' },
            { icon: 'cubeTransparent', label: 'With', value: 'tab2' },
            { icon: 'cubeTransparent', label: 'Icon', value: 'tab3' },
          ]"
        />
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Separators</BaseHeadline>
      <div class="w-96 space-y-4">
        <BaseSeparator />
        <BaseSeparator variant="dashed" />
      </div>
    </div>
    <BaseModal
      id="base-modal"
      :isModalOpen="isModalOpen"
      @close:modal="isModalOpen = false"
    >
      <template #header>
        <h1 class="mb-4 font-semibold tracking-tight">Modal title</h1>
      </template>
      <template #body>
        <p class="text-base">Content</p>
      </template>
      <template #footer>
        <BaseButton
          class="w-24"
          id="base-modal-cancel-button"
          variant="secondary"
          @keydown.enter="isModalOpen = false"
          @mousedown="isModalOpen = false"
        >
          Cancel
        </BaseButton>
        <BaseButton
          class="w-24"
          id="base-modal-confirm-button"
          variant="primary"
          @keydown.enter="isModalOpen = false"
          @mousedown="isModalOpen = false"
        >
          Confirm
        </BaseButton>
      </template>
    </BaseModal>
    <BaseDrawer
      id="base-bottom-drawer"
      variant="bottom"
      :isDrawerOpen="isBottomDrawerOpen"
      @close:drawer="isBottomDrawerOpen = false"
    >
      <template #header>
        <BaseHeadline class="px-4 py-8">Bottom drawer title</BaseHeadline>
      </template>
      <template #body>
        <BaseBody class="px-4">Content</BaseBody>
      </template>
      <template #footer>
        <div class="flex flex-row justify-end space-x-2 p-4">
          <BaseButton
            class="w-24"
            id="base-modal-confirm-button"
            variant="primary"
            @keydown.enter="isBottomDrawerOpen = false"
            @mousedown="isBottomDrawerOpen = false"
          >
            Close
          </BaseButton>
        </div>
      </template>
    </BaseDrawer>
    <BaseDrawer
      id="base-right-drawer"
      variant="right"
      :isDrawerOpen="isRightDrawerOpen"
      @close:drawer="isRightDrawerOpen = false"
    >
      <template #header>
        <BaseHeadline class="px-4 py-8">Right drawer title</BaseHeadline>
      </template>
      <template #body>
        <BaseBody class="px-4">Content</BaseBody>
      </template>
      <template #footer>
        <div class="flex flex-row justify-end space-x-2 p-4">
          <BaseButton
            class="w-24"
            id="base-modal-confirm-button"
            variant="primary"
            @keydown.enter="isRightDrawerOpen = false"
            @mousedown="isRightDrawerOpen = false"
          >
            Close
          </BaseButton>
        </div>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseBody from '#src/components/base/baseBody.vue';
import BaseButton from '#src/components/base/baseButton.vue';
import BaseDrawer from '#src/components/base/baseDrawer.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseModal from '#src/components/base/baseModal.vue';
import BaseSeparator from '#src/components/base/baseSeparator.vue';
import BaseTabList from '#src/components/base/baseTabList.vue';

import MatchDrawer from '../matches/components/matchDrawer.vue';

const isModalOpen = ref(false);
const isBottomDrawerOpen = ref(false);
const isRightDrawerOpen = ref(false);
const temporary = ref(false);
const selectedTab = ref('tab1');
</script>
