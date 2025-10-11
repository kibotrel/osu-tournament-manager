<template>
  <Transition name="modal">
    <div
      v-show="properties.isModalOpen"
      class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
      ref="modal"
      @mousedown="emit('close:modal')"
    >
      <div
        class="bg-primary-4 border-primary-3 relative w-1/3 rounded-md border-2 p-4"
        @mousedown.stop
      >
        <div>
          <x-mark-icon
            class="text-primary-1 hover:text-primary-1/90 active:text-primary-1/80 absolute right-0 mr-4 h-6 hover:cursor-pointer"
            @click="emit('close:modal')"
          />
        </div>
        <div>
          <slot name="header"> </slot>
        </div>
        <div class="my-4">
          <slot name="body"> </slot>
        </div>
        <div>
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

import xMarkIcon from '#src/components/icons/xMarkIcon.vue';
import { useEscapeBehavior } from '#src/composables/useEscapeBehaviorComposable.js';

interface Properties {
  isModalOpen: boolean;
}

const properties = defineProps<Properties>();
const emit = defineEmits(['close:modal']);
const modal = useTemplateRef<HTMLDivElement>('modal');

useEscapeBehavior({ target: modal, onEscape: () => emit('close:modal') });
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.1s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
