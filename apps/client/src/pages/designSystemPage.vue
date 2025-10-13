<template>
  <div class="m-4">
    <BaseHeadline variant="hero">Design System</BaseHeadline>
    <div class="my-4 space-y-2">
      <BaseHeadline variant="title">Headlines</BaseHeadline>
      <div class="space-y-1">
        <BaseHeadline variant="hero"
          >The quick brown fox jumps over the lazy dog
        </BaseHeadline>
        <BaseHeadline variant="title"
          >The quick brown fox jumps over the lazy dog
        </BaseHeadline>
        <BaseHeadline variant="subtitle"
          >The quick brown fox jumps over the lazy dog
        </BaseHeadline>
      </div>
    </div>
    <div class="my-4 space-y-2">
      <BaseHeadline variant="title">Bodies</BaseHeadline>
      <div class="space-y-1">
        <BaseBody variant="base">
          The quick brown fox jumps over the lazy dog
        </BaseBody>
        <BaseBody variant="small">
          The quick brown fox jumps over the lazy dog
        </BaseBody>
      </div>
    </div>
    <div class="my-4 space-y-2">
      <BaseHeadline variant="title">Captions</BaseHeadline>
      <div class="space-y-1">
        <BaseCaption variant="base"
          >The quick brown fox jumps over the lazy dog
        </BaseCaption>
      </div>
    </div>
    <div class="my-4 space-y-2">
      <BaseHeadline variant="title">Buttons</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton class="w-32" id="button-primary" variant="primary">
          Primary
        </BaseButton>
        <BaseButton
          class="w-32"
          id="button-primary-with-icon"
          variant="primary"
        >
          With icon
          <template #icon>
            <BaseIcon name="cubeTransparent" />
          </template>
        </BaseButton>
        <BaseButton
          class="w-32"
          id="button-loading"
          isLoading
          variant="primary"
        />
        <BaseButton
          class="w-32"
          id="button-disabled"
          isDisabled
          variant="primary"
        >
          Disabled
        </BaseButton>
      </div>
      <div class="flex flex-row space-x-2">
        <BaseButton class="w-32" variant="secondary" id="button-secondary">
          Secondary
        </BaseButton>
        <BaseButton class="w-32" variant="ghost" id="button-ghost">
          Ghost
        </BaseButton>
        <BaseButton class="w-32" variant="success" id="button-success">
          Success
        </BaseButton>
        <BaseButton class="w-32" variant="warning" id="button-warning">
          Warning
        </BaseButton>
        <BaseButton class="w-32" variant="danger" id="button-danger">
          Danger
        </BaseButton>
      </div>
    </div>
    <div class="my-8 space-y-2 text-2xl">
      <BaseHeadline variant="title">Inputs</BaseHeadline>
      <div class="flex flex-row items-end space-x-2">
        <BaseInput
          id="string-input"
          label="Label"
          placeholder="String"
          v-model="stringInputValue"
        />
        <BaseInput
          id="number-input"
          label="Label"
          placeholder="Number"
          type="number"
          v-model="numberInputValue"
        />
        <BaseInput
          id="disabled-input"
          isDisabled
          label="Label"
          placeholder="Disabled"
        />
      </div>
      <div class="mt-4 flex flex-row space-x-2">
        <BaseInput
          errorMessage="Error message"
          id="error-input"
          label="Label"
          placeholder="Error"
          v-model="stringErrorValue"
        />
        <BaseInput
          id="required-input"
          isRequired
          label="Label"
          placeholder="Required"
          v-model="stringInputValue"
        />
        <BaseInput
          class="mt-6"
          id="no-label-input"
          placeholder="No label"
          v-model="stringInputValue"
        />
        <BaseInput
          class="mt-6"
          id="ghost-input"
          placeholder="Ghost"
          v-model="stringInputValue"
          variant="ghost"
        />
      </div>
    </div>
    <div class="my-8 space-y-2 text-2xl">
      <BaseHeadline variant="title">Icons</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseIcon
          v-for="icon in icons"
          :name="icon"
          v-bind:key="icon"
          class="h-6 w-6"
        />
      </div>
    </div>
    <div class="my-8 space-y-2 text-2xl">
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
    <div class="my-8 space-y-2 text-2xl">
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
        <h1 class="pb-4">Bottom drawer title</h1>
      </template>
      <template #body>
        <p class="text-base">Content</p>
      </template>
      <template #footer>
        <BaseButton
          class="w-24"
          id="base-modal-confirm-button"
          variant="primary"
          @keydown.enter="isBottomDrawerOpen = false"
          @mousedown="isBottomDrawerOpen = false"
        >
          Close
        </BaseButton>
      </template>
    </BaseDrawer>
    <BaseDrawer
      id="base-right-drawer"
      variant="right"
      :isDrawerOpen="isRightDrawerOpen"
      @close:drawer="isRightDrawerOpen = false"
    >
      <template #header>
        <h1 class="pb-4 font-semibold tracking-tight">Right drawer title</h1>
      </template>
      <template #body>
        <p class="text-base">Content</p>
      </template>
      <template #footer>
        <BaseButton
          class="w-24"
          id="base-modal-confirm-button"
          variant="primary"
          @keydown.enter="isRightDrawerOpen = false"
          @mousedown="isRightDrawerOpen = false"
        >
          Close
        </BaseButton>
        <BaseButton
          class="w-24"
          id="base-modal-confirm-button"
          variant="primary"
          @keydown.enter="isRightDrawerOpen = false"
          @mousedown="isRightDrawerOpen = false"
        >
          Close
        </BaseButton>
      </template>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseBody from '#src/components/base/baseBody.vue';
import BaseButton from '#src/components/base/baseButton.vue';
import BaseCaption from '#src/components/base/baseCaption.vue';
import BaseDrawer from '#src/components/base/baseDrawer.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import type { IconNames } from '#src/components/base/baseIcon.vue';
import BaseIcon from '#src/components/base/baseIcon.vue';
import BaseInput from '#src/components/base/baseInput.vue';
import BaseModal from '#src/components/base/baseModal.vue';

const icons: IconNames[] = [
  'archiveBox',
  'arrowLeftStartOnRectangle',
  'arrowRightEndOnRectangle',
  'cubeTransparent',
  'identification',
  'loading',
  'paperAirplane',
  'play',
  'xMark',
];
const stringInputValue = ref('');
const numberInputValue = ref('');
const stringErrorValue = ref('Wrong input');
const isModalOpen = ref(false);
const isBottomDrawerOpen = ref(false);
const isRightDrawerOpen = ref(false);
</script>
