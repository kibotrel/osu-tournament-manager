<template>
  <div class="m-4">
    <BaseHeadline variant="hero">
      {{ $t('pages.designSystem.title') }}
    </BaseHeadline>
    <BaseTabList
      id="design-system-page-tab-list"
      v-model="tab"
      class="my-4"
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
import { useTranslation } from 'i18next-vue';
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

const { t } = useTranslation();
const tab = ref('texts');
const tabs: Tab[] = [
  { icon: 'text', label: t('pages.designSystem.words.text'), value: 'texts' },
  {
    icon: 'cursorArrowRays',
    label: t('pages.designSystem.words.interaction'),
    value: 'Interactions',
  },
  {
    icon: 'rectangleGroup',
    label: t('pages.designSystem.words.layout'),
    value: 'layout',
  },
  {
    icon: 'cubeTransparent',
    label: t('pages.designSystem.words.component'),
    value: 'components',
  },
];
</script>
