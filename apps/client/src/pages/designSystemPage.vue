<template>
  <div class="m-4">
    <h1 class="my-4 text-4xl font-semibold tracking-tight">Design System</h1>
    <div class="my-2 space-y-2 text-2xl">
      <h2>Buttons</h2>
      <div
        class="flex flex-row space-x-2"
        v-for="{ variant, name } in buttonVariants"
        v-bind:key="name"
      >
        <ui-button class="w-32" :variant="variant"> {{ name }} </ui-button>
        <ui-button class="w-32" :variant="variant">
          <template #default> {{ name }} </template>
          <template #icon>
            <transparent-cube-icon />
          </template>
        </ui-button>
        <ui-button class="w-32" :variant="variant">
          <template #icon>
            <transparent-cube-icon />
          </template>
        </ui-button>
        <ui-button v-if="variant === 'primary'" class="w-32" isLoading />
        <ui-button v-if="variant === 'primary'" class="w-32" isDisabled>
          Disabled
        </ui-button>
      </div>
    </div>
    <div class="my-2 space-y-2 text-2xl">
      <h2>Inputs</h2>
      <div class="flex flex-row items-end space-x-2">
        <ui-input
          label="Label"
          placeholder="String"
          v-model="stringInputValue"
        />
        <ui-input
          label="Label"
          placeholder="Number"
          type="number"
          v-model="numberInputValue"
        />
        <ui-input isDisabled label="Label" placeholder="Disabled" />
      </div>
      <div class="mt-4 flex flex-row space-x-2">
        <ui-input
          class="mt-6"
          placeholder="No label"
          v-model="stringInputValue"
        />
        <ui-input
          isRequired
          label="Label"
          placeholder="Required"
          v-model="stringInputValue"
        />
        <ui-input
          errorMessage="Error message"
          label="Label"
          placeholder="Error"
          v-model="stringErrorValue"
        />
      </div>
    </div>
    <div class="my-2 space-y-2 text-2xl">
      <h2>Icons</h2>
      <div class="flex flex-row space-x-2">
        <ui-icon
          v-for="icon in icons"
          :name="icon"
          v-bind:key="icon"
          class="h-6 w-6"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import transparentCubeIcon from '#src/components/icons/transparentCubeIcon.vue';
import type { ButtonVariant } from '#src/components/ui/uiButton.vue';
import uiButton from '#src/components/ui/uiButton.vue';
import type { IconNames } from '#src/components/ui/uiIcon.vue';
import uiIcon from '#src/components/ui/uiIcon.vue';
import uiInput from '#src/components/ui/uiInput.vue';

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
  'archive',
  'identification',
  'leave',
  'loading',
  'transparentCube',
];
const stringInputValue = ref('');
const numberInputValue = ref('');
const stringErrorValue = ref('Error');
</script>
