<template>
  <div class="relative overflow-visible">
    <EllipsisVerticalIcon
      class="dropdown-trigger"
      tabindex="0"
      @keydown.enter="isOpen = true"
      @mousedown="isOpen = true"
    />

    <Transition name="dropdown">
      <div v-show="isOpen" ref="dropdown" class="dropdown-menu">
        <div
          v-for="item in items"
          :id="item.id"
          :key="item.label"
          class="dropdown-item"
          tabindex="0"
          @keydown.enter="selectItem(item)"
          @mousedown="selectItem(item)"
        >
          <BaseBody variant="small">{{ item.label }}</BaseBody>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';

import EllipsisVerticalIcon from '#src/components/icons/ellipsisVerticalIcon.vue';
import { usePopUpBehavior } from '#src/composables/usePopUpComposable.js';

import BaseBody from './baseBody.vue';

export interface DropdownItem {
  id: string;
  label: string;
  onSelect: () => void;
}

interface Properties {
  items: DropdownItem[];
}

defineProps<Properties>();

const dropdown = useTemplateRef<HTMLDivElement>('dropdown');
const isOpen = ref(false);

usePopUpBehavior({
  element: dropdown,
  onClose: () => {
    isOpen.value = false;
  },
});

const selectItem = (item: DropdownItem) => {
  isOpen.value = false;

  item.onSelect();
};
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.dropdown-menu {
  @apply bg-primary-4 border-primary-3 absolute top-full left-0 z-100 mt-2 rounded-md border whitespace-nowrap;
}

.dropdown-item {
  @apply text-primary-1 cursor-pointer px-4 py-2 ring-0 outline-none;
  @apply hover:bg-primary-3;
  @apply focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-hidden;
  @apply first:rounded-t-sm last:rounded-b-sm;
}

.dropdown-trigger {
  @apply text-primary-1 h-6 w-6 cursor-pointer rounded-md ring-0 outline-none;
  @apply hover:text-primary-2;
  @apply focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-hidden;
}

.dropdown-enter-active {
  animation: stretchDown 0.2s ease-out;
  transform: scaleY(0);
  transform-origin: top;
}

.dropdown-leave-active {
  animation: stretchDown 0.2s ease-out reverse;
}

@keyframes stretchDown {
  from {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
  }
  to {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: top;
  }
}
</style>
