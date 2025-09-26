<template>
  <div
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
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';

import xMarkIcon from '#src/components/icons/xMarkIcon.vue';

const emit = defineEmits(['close:modal']);
const modal = useTemplateRef<HTMLDivElement>('modal');
const targetIsVisible = shallowRef(false);

useIntersectionObserver(modal, ([{ isIntersecting }]) => {
  targetIsVisible.value = isIntersecting || false;
});

const handleKeydown = (event: KeyboardEvent) => {
  event.stopPropagation();

  if (event.key === 'Escape') {
    emit('close:modal');
  }
};

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

watch(targetIsVisible, (isVisible) => {
  if (isVisible) {
    window.addEventListener('keydown', handleKeydown);
  } else {
    window.removeEventListener('keydown', handleKeydown);
  }
});
</script>

<style scoped></style>
