<template>
  <div class="m-4">
    <BaseHeadline variant="hero">Design System</BaseHeadline>
    <BaseTabList
      class="my-4"
      id="design-system-page-tab-list"
      v-model="tab"
      :tabs
    />
    <div v-if="tab === 'texts'">
      <DesignSystemTexts />
    </div>
    <div v-else-if="tab === 'Interactions'">
      <DesignSystemInteractions />
    </div>
    <div v-else-if="tab === 'layout'">
      <DesignSystemLayout />
    </div>
    <div v-else-if="tab === 'components'">
      <DesignSystemComponents />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseHeadline from '#src/components/base/baseHeadline.vue';
import type { IconName } from '#src/components/base/baseIcon.vue';
import BaseTabList from '#src/components/base/baseTabList.vue';

import DesignSystemComponents from './designSystemComponents.vue';
import DesignSystemInteractions from './designSystemInteractions.vue';
import DesignSystemLayout from './designSystemLayout.vue';
import DesignSystemTexts from './designSystemTexts.vue';

interface Tab {
  icon: IconName;
  label: string;
  value: string;
}

const tab = ref('texts');
const tabs: Tab[] = [
  { icon: 'text', label: 'Texts', value: 'texts' },
  {
    icon: 'cursorArrowRays',
    label: 'Interactions',
    value: 'Interactions',
  },
  { icon: 'rectangleGroup', label: 'Layout', value: 'layout' },
  { icon: 'cubeTransparent', label: 'Components', value: 'components' },
];
</script>
