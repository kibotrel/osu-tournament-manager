<template>
  <div ref="wrapper" class="relative overflow-visible">
    <BaseIcon
      :name="dropdownIcon"
      class="dropdown-trigger"
      tabindex="0"
      @keydown.enter="isOpen = true"
      @mousedown="isOpen = true"
    />
    <Transition name="dropdown">
      <div
        v-show="isOpen"
        ref="dropdown"
        class="dropdown-menu"
        :class="{
          'right-0 origin-top-right': alignRight,
          'left-0 origin-top-left': !alignRight,
        }"
      >
        <div
          v-for="item in items"
          :id="item.id"
          :key="item.label"
          class="dropdown-item"
          tabindex="0"
          @keydown.enter="selectItem(item)"
          @mousedown="selectItem(item)"
        >
          <div class="flex items-center gap-2">
            <BaseIcon
              v-if="item.icon"
              class="size-5 shrink-0"
              :name="item.icon"
            />
            <BaseCountryFlag
              v-else-if="item.countryCode"
              class="h-5 w-5 shrink-0"
              :country-code="item.countryCode"
            />
            <BaseBody>{{ item.label }}</BaseBody>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';

import { usePopUpBehavior } from '#src/composables/usePopUpComposable.js';

import BaseBody from './baseBody.vue';
import BaseCountryFlag from './baseCountryFlag.vue';
import type { IconName } from './baseIcon.vue';
import BaseIcon from './baseIcon.vue';

export interface DropdownItem {
  id: string;
  countryCode?: string;
  icon?: IconName;
  label: string;
  onSelect: () => void;
}

interface Properties {
  dropdownIcon?: IconName;
  items: DropdownItem[];
}

withDefaults(defineProps<Properties>(), {
  dropdownIcon: 'ellipsisVertical',
});

const dropdown = useTemplateRef<HTMLDivElement>('dropdown');
const wrapper = useTemplateRef<HTMLDivElement>('wrapper');
const isOpen = ref(false);
const alignRight = ref(true);

usePopUpBehavior({
  element: dropdown,
  onClose: () => {
    isOpen.value = false;
  },
});

watch(isOpen, (value) => {
  if (value && wrapper.value) {
    const rectangle = wrapper.value.getBoundingClientRect();

    alignRight.value = rectangle.left > window.innerWidth / 2;
  }
});

const selectItem = (item: DropdownItem) => {
  isOpen.value = false;

  item.onSelect();
};
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.dropdown-menu {
  @apply bg-primary-4 border-primary-3 absolute top-full z-100 mt-2 rounded-md border-2 whitespace-nowrap;
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
}

.dropdown-leave-active {
  animation: stretchDown 0.2s ease-out reverse;
}

@keyframes stretchDown {
  from {
    opacity: 0;
    transform: scaleY(0);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}
</style>
