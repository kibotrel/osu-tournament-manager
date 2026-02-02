<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">Drawers</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton
          id="open-bottom-drawer"
          class="w-32"
          @keydown.enter="isBottomDrawerOpen = true"
          @mousedown="isBottomDrawerOpen = true"
        >
          Bottom
        </BaseButton>
        <BaseButton
          id="open-right-drawer"
          class="w-32"
          @keydown.enter="isRightDrawerOpen = true"
          @mousedown="isRightDrawerOpen = true"
        >
          Right
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Dropdowns</BaseHeadline>
      <div class="flex flex-row items-center space-x-2">
        <BaseDropdown
          id="dropdown"
          v-model="isDropdownOpen"
          :items="dropdownItems"
          @keydown.enter="isDropdownOpen = true"
          @mousedown="isDropdownOpen = true"
        />
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Modals</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton
          id="base-modal"
          class="w-32"
          @keydown.enter="isModalOpen = true"
          @mousedown="isModalOpen = true"
        >
          Base
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Separators</BaseHeadline>
      <div class="w-96 space-y-4">
        <BaseSeparator />
        <BaseSeparator variant="dashed" />
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Tab Lists</BaseHeadline>
      <div class="w-96 space-y-4">
        <BaseTabList
          id="base-tab-list"
          v-model="selectedTab"
          :tabs="[
            { label: 'Base', value: 'tab1' },
            { label: 'Tab', value: 'tab2' },
            { label: 'List', value: 'tab3' },
          ]"
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
    <BaseModal
      id="base-modal"
      :is-modal-open="isModalOpen"
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
          id="base-modal-cancel-button"
          class="w-24"
          variant="secondary"
          @keydown.enter="isModalOpen = false"
          @mousedown="isModalOpen = false"
        >
          Cancel
        </BaseButton>
        <BaseButton
          id="base-modal-confirm-button"
          class="w-24"
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
      :is-drawer-open="isBottomDrawerOpen"
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
            id="base-modal-confirm-button"
            class="w-24"
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
      :is-drawer-open="isRightDrawerOpen"
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
            id="base-modal-confirm-button"
            class="w-24"
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
import type { DropdownItem } from '#src/components/base/baseDropdown.vue';
import BaseDropdown from '#src/components/base/baseDropdown.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseModal from '#src/components/base/baseModal.vue';
import BaseSeparator from '#src/components/base/baseSeparator.vue';
import BaseTabList from '#src/components/base/baseTabList.vue';

const isModalOpen = ref(false);
const isBottomDrawerOpen = ref(false);
const isDropdownOpen = ref(false);
const isRightDrawerOpen = ref(false);
const selectedTab = ref('tab1');
const dropdownItems: DropdownItem[] = [
  {
    id: 'option-1',
    label: 'Option 1',
    onSelect: () => {
      console.log('Option 1');
    },
  },
  {
    id: 'option-2',
    label: 'Option 2',
    onSelect: () => {
      console.log('Option 2');
    },
  },
  {
    id: 'option-3',
    label: 'Option 3',
    onSelect: () => {
      console.log('Option 3');
    },
  },
];
</script>
