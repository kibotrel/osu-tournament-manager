<template>
  <button
    :class="properties.variant"
    :disabled="properties.isLoading || properties.isDisabled"
  >
    <div v-if="isLoading">
      <loading-icon class="h-6 w-6" />
    </div>
    <div v-else class="flex items-center">
      <div v-if="slots.icon" class="mr-2 h-6 w-6">
        <slot name="icon" />
      </div>

      <div>
        <slot />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

import loadingIcon from '#src/components/icons/loadingIcon.vue';

export type ButtonVariants =
  | 'danger'
  | 'ghost'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning';

interface Properties {
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariants;
}

const properties = withDefaults(defineProps<Properties>(), {
  isDisabled: false,
  isLoading: false,
  variant: 'primary',
});
const slots = useSlots();
</script>

<style scoped>
.danger {
  @apply cursor-pointer bg-red-600 text-primary-1;
  @apply hover:bg-red-600/90 hover:text-primary-1/90;
  @apply active:bg-red-600/80 active:text-primary-1/80;
}

.ghost {
  @apply cursor-pointer bg-transparent text-primary-1;
  @apply hover:text-primary-1/90;
  @apply active:text-primary-1/80;
}

.primary {
  @apply cursor-pointer bg-primary-1 text-primary-4;
  @apply hover:bg-primary-1/90 hover:text-primary-4/90;
  @apply active:bg-primary-1/80 active:text-primary-4/80;
}

.secondary {
  @apply cursor-pointer bg-primary-3 text-primary-1;
  @apply hover:bg-primary-3/90 hover:text-primary-1/90;
  @apply active:bg-primary-3/80 active:text-primary-1/80;
}

.success {
  @apply cursor-pointer bg-green-500 text-primary-1;
  @apply hover:bg-green-500/90 hover:text-primary-1/90;
  @apply active:bg-green-500/80 active:text-primary-1/80;
}

.warning {
  @apply cursor-pointer bg-yellow-400 text-primary-4;
  @apply hover:bg-yellow-400/90 hover:text-primary-4/90;
  @apply active:bg-yellow-400/80 active:text-primary-4/80;
}

button {
  @apply flex items-center justify-center;
  @apply rounded-md p-2 text-base font-medium;
}

button:disabled {
  @apply cursor-not-allowed bg-primary-2 text-primary-4;
  @apply hover:bg-primary-2 hover:text-primary-4;
}

button:focus-visible {
  @apply outline-none ring-2 ring-yellow-400;
}
</style>
