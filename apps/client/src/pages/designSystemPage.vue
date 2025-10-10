<template>
  <div class="m-4">
    <h1 class="text-4xl font-semibold tracking-tight">Design System</h1>
    <div class="my-4 space-y-2 text-2xl">
      <h2>Buttons</h2>
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
      <h2>Inputs</h2>
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
      <h2>Icons</h2>
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
      <h2>Modals</h2>
      <div class="flex flex-row space-x-2">
        <BaseButton
          class="w-32"
          id="base-modal"
          @click="isDefaultModalVisible = true"
        >
          Base
        </BaseButton>
        <BaseModal
          v-show="isDefaultModalVisible"
          @close:modal="isDefaultModalVisible = false"
        >
          <template #header>
            <h1 class="mb-4 font-semibold tracking-tight">Modal title</h1>
          </template>
          <template #body>
            <p class="text-base">Content</p>
          </template>
          <template #footer>
            <div class="mt-4 flex flex-row justify-end space-x-2">
              <BaseButton
                class="w-24"
                id="base-modal-cancel-button"
                variant="secondary"
                @mousedown="isDefaultModalVisible = false"
              >
                Cancel
              </BaseButton>
              <BaseButton
                class="w-24"
                id="base-modal-confirm-button"
                variant="primary"
                @mousedown="isDefaultModalVisible = false"
              >
                Confirm
              </BaseButton>
            </div>
          </template>
        </BaseModal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseButton from '#src/components/base/baseButton.vue';
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
const isDefaultModalVisible = ref(false);
</script>
