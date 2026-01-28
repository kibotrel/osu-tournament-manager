<template>
  <div class="tab-list">
    <div
      v-for="tab in tabs"
      :class="['tab', tab.value === selected ? 'selected' : 'not-selected']"
      :id="`tab-${tab.value}`"
      :key="tab.value"
      :tabindex="selected === tab.value ? -1 : 0"
      @keydown.enter="selectTab(tab.value)"
      @mousedown="selectTab(tab.value)"
    >
      <BaseIcon v-if="tab.icon" :name="tab.icon" class="h-6 w-6" />
      <BaseHeadline variant="subtitle">{{ tab.label }}</BaseHeadline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseHeadline from './baseHeadline.vue';
import type { IconName } from './baseIcon.vue';
import BaseIcon from './baseIcon.vue';

interface Tab {
  label: string;
  icon?: IconName;
  value: string;
}

interface Properties {
  tabs: Tab[];
  modelValue?: string;
}

const properties = defineProps<Properties>();
const emit = defineEmits(['update:modelValue']);
const selected = ref(properties.modelValue ?? properties.tabs.at(0)?.value);

const selectTab = (value: string) => {
  selected.value = value;
  emit('update:modelValue', value);
};
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.tab-list {
  @apply border-primary-3 flex flex-row items-center border-b-2;
}

.tab {
  @apply -mb-0.5 flex flex-row items-center space-x-2 px-4 py-2;
}

.selected {
  @apply cursor-default border-b-2 border-yellow-400;
}

.not-selected {
  @apply text-primary-2 cursor-pointer;
}

.not-selected:hover {
  @apply text-primary-2/80;
}

.tab:focus-visible {
  @apply rounded-md ring-2 ring-yellow-400 outline-hidden;
}
</style>
