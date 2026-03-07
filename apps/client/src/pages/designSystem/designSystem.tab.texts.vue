<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">
        {{ $t('pages.designSystem.tabs.text.words.headline') }}
      </BaseHeadline>
      <div v-for="variant in headlineVariants" :key="variant">
        <BaseHeadline :variant="variant">
          {{ $t('pages.designSystem.tabs.text.pangram') }}
        </BaseHeadline>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.text.words.body')
      }}</BaseHeadline>
      <div v-for="variant in bodyVariants" :key="variant">
        <BaseBody :variant="variant">
          {{ $t('pages.designSystem.tabs.text.pangram') }}
        </BaseBody>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.tabs.text.words.caption')
      }}</BaseHeadline>
      <div>
        <BaseCaption variant="base">
          {{ $t('pages.designSystem.tabs.text.pangram') }}
        </BaseCaption>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">{{
        $t('pages.designSystem.words.icon')
      }}</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseIcon
          v-for="icon in icons"
          :key="icon"
          :name="icon"
          class="h-6 w-6"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BodyVariant } from '#src/components/base/body.base.vue';
import BaseBody from '#src/components/base/body.base.vue';
import BaseCaption from '#src/components/base/caption.base.vue';
import type { HeadlineVariant } from '#src/components/base/headline.base.vue';
import BaseHeadline from '#src/components/base/headline.base.vue';
import type { IconName } from '#src/components/base/icon.base.vue';
import BaseIcon from '#src/components/base/icon.base.vue';

const icons: IconName[] = [
  'arrowLeftStartOnRectangle',
  'arrowPath',
  'arrowRightEndOnRectangle',
  'check',
  'checkCircle',
  'chevronDoubleDown',
  'chevronDoubleRight',
  'clipboard',
  'clock',
  'commandLine',
  'crown',
  'cubeTransparent',
  'cursorArrowRays',
  'ellipsisVertical',
  'exclamationCircle',
  'gear',
  'identification',
  'informationCircle',
  'language',
  'loading',
  'paperAirplane',
  'play',
  'rectangleGroup',
  'signal',
  'text',
  'xCircle',
  'xMark',
];
const headlineVariants: HeadlineVariant[] = ['hero', 'title', 'subtitle'];
const bodyVariants: BodyVariant[] = ['base', 'small'];
</script>
