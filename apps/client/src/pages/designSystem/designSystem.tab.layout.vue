<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.layout.words.drawer')
      }}</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton
          id="open-bottom-drawer"
          class="w-32"
          @keydown.enter="isBottomDrawerOpen = true"
          @mousedown="isBottomDrawerOpen = true"
        >
          {{ $t('global.words.bottom') }}
        </BaseButton>
        <BaseButton
          id="open-right-drawer"
          class="w-32"
          @keydown.enter="isRightDrawerOpen = true"
          @mousedown="isRightDrawerOpen = true"
        >
          {{ $t('global.words.right') }}
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.layout.words.dropdown')
      }}</BaseHeadline>
      <div class="flex flex-col gap-2">
        <div class="flex items-center space-x-2">
          <BaseDropdown
            id="dropdown"
            v-model="isDropdownOpen"
            :items="dropdownItems"
            @keydown.enter="isDropdownOpen = true"
            @mousedown="isDropdownOpen = true"
          />
          <BaseBody>{{ $t('pages.designSystem.words.base') }}</BaseBody>
        </div>
        <div class="flex items-center space-x-2">
          <BaseDropdown
            id="dropdown-with-flag"
            v-model="isDropdownOpenWithFlag"
            :items="dropdownWithFlagItems"
            @keydown.enter="isDropdownOpenWithFlag = true"
            @mousedown="isDropdownOpenWithFlag = true"
          />
          <BaseBody>{{
            $t('pages.designSystem.tabs.layout.words.flag')
          }}</BaseBody>
        </div>
        <div class="flex items-center space-x-2">
          <BaseDropdown
            id="dropdown-with-icon"
            v-model="isDropdownOpenWithIcon"
            :items="dropdownWithIconItems"
            @keydown.enter="isDropdownOpenWithIcon = true"
            @mousedown="isDropdownOpenWithIcon = true"
          />
          <BaseBody>{{ $t('pages.designSystem.words.icon') }}</BaseBody>
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.layout.words.modal')
      }}</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton
          id="base-modal"
          class="w-32"
          @keydown.enter="isModalOpen = true"
          @mousedown="isModalOpen = true"
        >
          {{ $t('pages.designSystem.words.base') }}
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.layout.words.separator')
      }}</BaseHeadline>
      <div class="w-96 space-y-4">
        <BaseSeparator />
        <BaseSeparator variant="dashed" />
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.layout.words.tabList')
      }}</BaseHeadline>
      <div class="w-96 space-y-4">
        <BaseTabList id="base-tab-list" :tabs="baseTabList" />
        <BaseTabList id="base-tab-list-with-icons" :tabs="tabsWithIconList" />
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.layout.words.toast')
      }}</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton
          id="show-toast"
          class="w-32"
          @keydown.enter="
            newToast.error(
              $t('pages.designSystem.tabs.layout.toasts.errorMessage'),
            )
          "
          @mousedown="
            newToast.error(
              $t('pages.designSystem.tabs.layout.toasts.errorMessage'),
            )
          "
        >
          {{ $t('global.words.error') }}
        </BaseButton>
        <BaseButton
          id="show-toast"
          class="w-32"
          @keydown.enter="
            newToast.info(
              $t('pages.designSystem.tabs.layout.toasts.infoMessage'),
            )
          "
          @mousedown="
            newToast.info(
              $t('pages.designSystem.tabs.layout.toasts.infoMessage'),
            )
          "
        >
          {{ $t('global.words.info') }}
        </BaseButton>
        <BaseButton
          id="show-toast"
          class="w-32"
          @keydown.enter="
            newToast.success(
              $t('pages.designSystem.tabs.layout.toasts.successMessage'),
            )
          "
          @mousedown="
            newToast.success(
              $t('pages.designSystem.tabs.layout.toasts.successMessage'),
            )
          "
        >
          {{ $t('global.words.success') }}
        </BaseButton>
        <BaseButton
          id="show-toast"
          class="w-32"
          @keydown.enter="
            newToast.warning(
              $t('pages.designSystem.tabs.layout.toasts.warningMessage'),
            )
          "
          @mousedown="
            newToast.warning(
              $t('pages.designSystem.tabs.layout.toasts.warningMessage'),
            )
          "
        >
          {{ $t('global.words.warning') }}
        </BaseButton>
      </div>
    </div>
  </div>
  <BaseModal
    id="base-modal"
    :is-modal-open="isModalOpen"
    @close:modal="isModalOpen = false"
  >
    <template #header>
      <h1 class="mb-4 font-semibold tracking-tight">
        {{ $t('pages.designSystem.tabs.layout.words.title') }}
      </h1>
    </template>
    <template #body>
      <p class="text-base">
        {{ $t('pages.designSystem.tabs.layout.words.content') }}
      </p>
    </template>
    <template #footer>
      <BaseButton
        id="base-modal-cancel-button"
        class="w-24"
        variant="secondary"
        @keydown.enter="isModalOpen = false"
        @mousedown="isModalOpen = false"
      >
        {{ $t('global.words.cancel') }}
      </BaseButton>
      <BaseButton
        id="base-modal-confirm-button"
        class="w-24"
        variant="primary"
        @keydown.enter="isModalOpen = false"
        @mousedown="isModalOpen = false"
      >
        {{ $t('global.words.confirm') }}
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
      <BaseHeadline class="px-4 py-8">
        {{ $t('pages.designSystem.tabs.layout.words.title') }}
      </BaseHeadline>
    </template>
    <template #body>
      <BaseBody class="px-4">
        {{ $t('pages.designSystem.tabs.layout.words.content') }}
      </BaseBody>
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
          {{ $t('global.words.close') }}
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
      <BaseHeadline class="px-4 py-8">
        {{ $t('pages.designSystem.tabs.layout.words.title') }}
      </BaseHeadline>
    </template>
    <template #body>
      <BaseBody class="px-4">
        {{ $t('pages.designSystem.tabs.layout.words.content') }}
      </BaseBody>
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
          {{ $t('global.words.close') }}
        </BaseButton>
      </div>
    </template>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { ref } from 'vue';

import BaseBody from '#src/components/base/body.base.vue';
import BaseButton from '#src/components/base/button.base.vue';
import BaseDrawer from '#src/components/base/drawer.base.vue';
import type { DropdownItem } from '#src/components/base/dropdown.base.vue';
import BaseDropdown from '#src/components/base/dropdown.base.vue';
import BaseHeadline from '#src/components/base/headline.base.vue';
import BaseModal from '#src/components/base/modal.base.vue';
import BaseSeparator from '#src/components/base/separator.base.vue';
import type { Tab } from '#src/components/base/tabList.base.vue';
import BaseTabList from '#src/components/base/tabList.base.vue';
import { useToasterStore } from '#src/stores/toaster.store.js';

const { t } = useTranslation();
const { newToast } = useToasterStore();
const isModalOpen = ref(false);
const isBottomDrawerOpen = ref(false);
const isDropdownOpen = ref(false);
const isDropdownOpenWithFlag = ref(false);
const isDropdownOpenWithIcon = ref(false);
const isRightDrawerOpen = ref(false);
const dropdownItems: DropdownItem[] = [
  {
    id: 'option-1',
    label: t('pages.designSystem.tabs.layout.words.option'),
    onSelect: () => {
      console.log('Option 1');
    },
  },
  {
    id: 'option-2',
    label: t('pages.designSystem.tabs.layout.words.option'),
    onSelect: () => {
      console.log('Option 2');
    },
  },
  {
    id: 'option-3',
    label: t('pages.designSystem.tabs.layout.words.option'),
    onSelect: () => {
      console.log('Option 3');
    },
  },
];
const dropdownWithFlagItems: DropdownItem[] = [
  {
    id: 'option-1',
    label: t('pages.designSystem.tabs.layout.words.flag'),
    countryCode: 'US',
    onSelect: () => {
      console.log('Option 1');
    },
  },
  {
    id: 'option-2',
    label: t('pages.designSystem.tabs.layout.words.flag'),
    countryCode: 'FR',
    onSelect: () => {
      console.log('Option 2');
    },
  },
  {
    id: 'option-3',
    label: t('pages.designSystem.tabs.layout.words.flag'),
    countryCode: 'JP',
    onSelect: () => {
      console.log('Option 3');
    },
  },
];
const dropdownWithIconItems: DropdownItem[] = [
  {
    id: 'option-1',
    label: t('pages.designSystem.words.icon'),
    icon: 'cubeTransparent',
    onSelect: () => {
      console.log('Option 1');
    },
  },
  {
    id: 'option-2',
    label: t('pages.designSystem.words.icon'),
    icon: 'cubeTransparent',
    onSelect: () => {
      console.log('Option 2');
    },
  },
  {
    id: 'option-3',
    label: t('pages.designSystem.words.icon'),
    icon: 'cubeTransparent',
    onSelect: () => {
      console.log('Option 3');
    },
  },
];
const baseTabList: Tab[] = [
  { label: t('pages.designSystem.tabs.layout.words.tab'), value: 'tab1' },
  { label: t('pages.designSystem.tabs.layout.words.tab'), value: 'tab2' },
  { label: t('pages.designSystem.tabs.layout.words.tab'), value: 'tab3' },
];
const tabsWithIconList: Tab[] = [
  {
    icon: 'cubeTransparent',
    label: t('pages.designSystem.tabs.layout.words.tab'),
    value: 'tab1',
  },
  {
    icon: 'cubeTransparent',
    label: t('pages.designSystem.tabs.layout.words.tab'),
    value: 'tab2',
  },
  {
    icon: 'cubeTransparent',
    label: t('pages.designSystem.tabs.layout.words.tab'),
    value: 'tab3',
  },
];
</script>
