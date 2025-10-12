<template>
  <Transition name="backdrop">
    <div
      v-show="properties.isDrawerOpen"
      class="fixed inset-0 z-10 bg-black/50"
      @mousedown="emit('close:drawer')"
    ></div>
  </Transition>
  <Transition :name="`drawer-${properties.variant}`">
    <div
      v-show="properties.isDrawerOpen"
      :class="properties.variant"
      ref="drawer"
    >
      <div>
        <XMarkIcon
          class="text-primary-1 hover:text-primary-1/90 active:text-primary-1/80 absolute right-0 mr-4 h-6 hover:cursor-pointer"
          @mousedown="emit('close:drawer')"
        />
      </div>
      <div>
        <slot name="header"> </slot>
      </div>
      <div class="flex-1 overflow-auto">
        <slot name="body"> </slot>
      </div>
      <div>
        <slot name="footer"> </slot>
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
  isDrawerOpen: boolean;
  variant: 'right' | 'bottom';
}

const properties = defineProps<Properties>();
const emit = defineEmits(['close:drawer']);
const drawer = useTemplateRef<HTMLDivElement>('drawer');

usePopUpBehavior({
  element: drawer,
  onEscape: () => emit('close:drawer'),
});
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.backdrop-enter-active,
.backdrop-leave-active {
  transition: all 0.3s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.drawer-bottom-enter-active,
.drawer-bottom-leave-active,
.drawer-right-enter-active,
.drawer-right-leave-active {
  transition: all 0.3s ease;
}

.drawer-right-enter-from,
.drawer-right-leave-to {
  transform: translateX(100%);
}

.drawer-bottom-enter-from,
.drawer-bottom-leave-to {
  transform: translateY(100%);
}

.right {
  @apply bg-primary-4 border-primary-3 fixed top-0 right-0 z-10 flex h-full w-1/3 flex-col border-l-2 p-4;
}

.bottom {
  @apply bg-primary-4 border-primary-3 fixed bottom-0 left-0 z-10 flex h-1/3 w-full flex-col border-t-2 p-4;
}
</style>
