<template>
  <Transition name="modal">
    <div
      class="fixed inset-0 z-11 flex items-center justify-center bg-black/50"
      v-show="isModalOpen"
    >
      <div
        class="bg-primary-4 border-primary-3 relative w-1/3 rounded-md border-2 p-4"
        ref="modal"
        :id
        @mousedown.stop
      >
        <div>
          <XMarkIcon
            class="x-mark"
            tabindex="0"
            @keydown.enter="emit('close:modal')"
            @mousedown="emit('close:modal')"
          />
        </div>
        <div class="border-primary-3">
          <slot name="header"> </slot>
        </div>
        <div class="flex-1 overflow-auto">
          <slot name="body"> </slot>
        </div>
        <div class="mt-4 flex flex-row justify-end space-x-2">
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import XMarkIcon from '#src/components/icons/xMarkIcon.vue';
import { usePopUpBehavior } from '#src/composables/usePopUpComposable.js';

interface Properties {
  id: string;
  isModalOpen: boolean;
}

defineProps<Properties>();

const emit = defineEmits(['close:modal']);
const modal = useTemplateRef<HTMLDivElement>('modal');

usePopUpBehavior({ element: modal, onClose: () => emit('close:modal') });
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.x-mark {
  @apply text-primary-1 hover:text-primary-1/90 active:text-primary-1/80 absolute right-0 mr-4 h-6 ring-0 outline-none hover:cursor-pointer;
}

.x-mark:focus-visible {
  @apply rounded-md ring-2 ring-yellow-400 outline-hidden;
}
</style>
