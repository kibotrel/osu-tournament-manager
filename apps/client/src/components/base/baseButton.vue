<template>
  <button
    :class="properties.variant"
    :disabled="properties.isLoading || properties.isDisabled"
    :id="properties.id"
  >
    <div v-if="isLoading">
      <LoadingIcon class="h-6 w-6" />
    </div>
    <div v-else class="flex items-center">
      <div v-if="slots.icon" class="mr-2 h-6 w-6">
        <slot name="icon" />
      </div>
      <BaseBody>
        <slot> Button </slot>
      </BaseBody>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

import LoadingIcon from '#src/components/icons/loadingIcon.vue';

import BaseBody from './baseBody.vue';

export type ButtonVariant =
  | 'danger'
  | 'ghost'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

interface Properties {
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
}

const properties = withDefaults(defineProps<Properties>(), {
  isDisabled: false,
  isLoading: false,
  variant: 'primary',
});
const slots = useSlots();
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

button {
  @apply flex items-center justify-center;
  @apply rounded-md p-2 text-base font-medium;
}

button:disabled {
  @apply bg-primary-2 text-primary-4 cursor-not-allowed;
  @apply hover:bg-primary-2 hover:text-primary-4;
}

button:focus-visible {
  @apply ring-2 ring-yellow-400 outline-hidden;
}

.danger {
  @apply text-primary-1 cursor-pointer bg-red-500;
  @apply hover:text-primary-1/90 hover:bg-red-500/90;
  @apply active:text-primary-1/80 active:bg-red-500/80;
}

.ghost {
  @apply text-primary-1 cursor-pointer bg-transparent;
  @apply hover:text-primary-1/90;
  @apply active:text-primary-1/80;
}

.primary {
  @apply bg-primary-1 text-primary-4 cursor-pointer;
  @apply hover:bg-primary-1/90 hover:text-primary-4/90;
  @apply active:bg-primary-1/80 active:text-primary-4/80;
}

.secondary {
  @apply bg-primary-3 text-primary-1 cursor-pointer;
  @apply hover:bg-primary-3/90 hover:text-primary-1/90;
  @apply active:bg-primary-3/80 active:text-primary-1/80;
}

.success {
  @apply text-primary-1 cursor-pointer bg-green-500;
  @apply hover:text-primary-1/90 hover:bg-green-500/90;
  @apply active:text-primary-1/80 active:bg-green-500/80;
}

.warning {
  @apply text-primary-4 cursor-pointer bg-yellow-400;
  @apply hover:text-primary-4/90 hover:bg-yellow-400/90;
  @apply active:text-primary-4/80 active:bg-yellow-400/80;
}
</style>
