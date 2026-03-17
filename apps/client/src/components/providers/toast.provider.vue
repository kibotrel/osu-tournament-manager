<template>
  <TransitionGroup name="toaster" tag="div" class="toaster">
    <BaseToast
      v-for="toast in toasts"
      :key="toast.id"
      :duration="toast.duration"
      :message="toast.message"
      :variant="toast.variant"
      @close:toast="deleteToast(toast)"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

import BaseToast from '#src/components/base/toast.base.vue';
import { useToasterStore } from '#src/stores/toaster.store.js';

const { deleteToast } = useToasterStore();
const { toasts } = storeToRefs(useToasterStore());
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.toaster {
  @apply absolute bottom-4 left-1/2 z-12 w-5/6 -translate-x-1/2 space-y-2;
  @apply sm:w-3/5 lg:w-1/2 xl:w-1/3;
}

.toaster-enter-active,
.toaster-leave-active {
  transition: all 0.5s ease;
}
.toaster-enter-from,
.toaster-leave-to {
  opacity: 0;
  transform: translateX(-53px);
}
</style>
