<template>
  <div class="m-4">
    <h1 class="text-4xl font-semibold tracking-tight">Design System</h1>
    <div class="my-4 space-y-2 text-2xl">
      <h2>Buttons</h2>
      <div
        class="flex flex-row space-x-2"
        v-for="{ variant, name } in buttonVariants"
        v-bind:key="name"
      >
        <BaseButton class="w-32" :variant="variant">
          {{ name }}
        </BaseButton>
        <BaseButton class="w-32" :variant="variant">
          <template #default> {{ name }} </template>
          <template #icon>
            <BaseIcon name="cubeTransparent" />
          </template>
        </BaseButton>
        <BaseButton class="w-32" :variant="variant">
          <template #icon>
            <BaseIcon name="cubeTransparent" />
          </template>
        </BaseButton>
        <BaseButton v-if="variant === 'primary'" class="w-32" isLoading />
        <BaseButton v-if="variant === 'primary'" class="w-32" isDisabled>
          Disabled
        </BaseButton>
      </div>
    </div>
    <div class="my-8 space-y-2 text-2xl">
      <h2>Inputs</h2>
      <div class="flex flex-row items-end space-x-2">
        <BaseInput
          label="Label"
          placeholder="String"
          v-model="stringInputValue"
        />
        <BaseInput
          label="Label"
          placeholder="Number"
          type="number"
          v-model="numberInputValue"
        />
        <BaseInput isDisabled label="Label" placeholder="Disabled" />
      </div>
      <div class="mt-4 flex flex-row space-x-2">
        <BaseInput
          errorMessage="Error message"
          label="Label"
          placeholder="Error"
          v-model="stringErrorValue"
        />
        <BaseInput
          isRequired
          label="Label"
          placeholder="Required"
          v-model="stringInputValue"
        />
        <BaseInput
          class="mt-6"
          placeholder="No label"
          v-model="stringInputValue"
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
        <BaseButton class="w-32" @click="isDefaultModalVisible = true">
          Base
        </BaseButton>
        <BaseModal
          v-show="isDefaultModalVisible"
          @close="isDefaultModalVisible = false"
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
                variant="secondary"
                @mousedown="isDefaultModalVisible = false"
              >
                Cancel
              </BaseButton>
              <BaseButton
                class="w-24"
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

import type { ButtonVariant } from '#src/components/base/baseButton.vue';
import BaseButton from '#src/components/base/baseButton.vue';
import type { IconNames } from '#src/components/base/baseIcon.vue';
import BaseIcon from '#src/components/base/baseIcon.vue';
import BaseInput from '#src/components/base/baseInput.vue';
import BaseModal from '#src/components/base/baseModal.vue';

const buttonVariants: Array<{
  name: string;
  variant: ButtonVariant;
}> = [
  { name: 'Primary', variant: 'primary' },
  { name: 'Secondary', variant: 'secondary' },
  { name: 'Ghost', variant: 'ghost' },
  { name: 'Success', variant: 'success' },
  { name: 'Warning', variant: 'warning' },
  { name: 'Danger', variant: 'danger' },
];
const icons: IconNames[] = [
  'archiveBox',
  'arrowLeftStartOnRectangle',
  'cubeTransparent',
  'identification',
  'loading',
  'xMark',
];
const stringInputValue = ref('');
const numberInputValue = ref('');
const stringErrorValue = ref('Wrong input');
const isDefaultModalVisible = ref(false);
</script>
