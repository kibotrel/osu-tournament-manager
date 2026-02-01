<template>
  <Transition name="backdrop">
    <div v-show="isDrawerOpen" class="fixed inset-0 z-10 bg-black/50"></div>
  </Transition>
  <Transition :name="`drawer-${variant}`">
    <div v-show="isDrawerOpen" :id ref="drawer" :class="[variant, 'drawer']">
      <div class="flex flex-row justify-between p-2">
        <BaseIcon
          class="action-icon"
          tabindex="0"
          :name="
            variant === 'right' ? 'chevronDoubleRight' : 'chevronDoubleDown'
          "
          @keydown.enter="emit('close:drawer')"
          @mousedown="emit('close:drawer')"
        />
        <EllipsisVerticalIcon
          class="action-icon"
          tabindex="0"
          @keydown.enter="emit('close:drawer')"
          @mousedown="emit('close:drawer')"
        />
      </div>
      <div>
        <slot name="header"> </slot>
      </div>
      <div class="mb-4 flex-1 overflow-auto">
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

import EllipsisVerticalIcon from '#src/components/icons/ellipsisVerticalIcon.vue';
import { usePopUpBehavior } from '#src/composables/usePopUpComposable.js';

import BaseIcon from './baseIcon.vue';

interface Properties {
  id: string;
  isDrawerOpen: boolean;
  variant: 'bottom' | 'right';
}

const emit = defineEmits(['close:drawer']);
const drawer = useTemplateRef<HTMLDivElement>('drawer');

defineProps<Properties>();
usePopUpBehavior({
  element: drawer,
  onClose: () => {
    return emit('close:drawer');
  },
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

.drawer {
  @apply bg-primary-4 border-primary-3 fixed z-10 flex flex-col rounded-md border-2;
}

.right {
  @apply top-4 right-4 h-[calc(100%-32px)] w-1/2;
}

.bottom {
  @apply bottom-0 left-4 h-1/2 w-[calc(100%-32px)];
}

.action-icon {
  @apply text-primary-2 hover:text-primary-2/80 active:text-primary-2/60 h-6 w-6 ring-0 outline-none hover:cursor-pointer;
}

.action-icon:focus-visible {
  @apply rounded-md ring-2 ring-yellow-400 outline-hidden;
}
</style>
