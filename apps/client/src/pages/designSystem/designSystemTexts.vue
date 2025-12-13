<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">Headlines</BaseHeadline>
      <div>
        <BaseHeadline variant="hero"
          >The quick brown fox jumps over the lazy dog
        </BaseHeadline>
        <BaseHeadline variant="title"
          >The quick brown fox jumps over the lazy dog
        </BaseHeadline>
        <BaseHeadline variant="subtitle"
          >The quick brown fox jumps over the lazy dog
        </BaseHeadline>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Bodies</BaseHeadline>
      <div>
        <BaseBody variant="base">
          The quick brown fox jumps over the lazy dog
        </BaseBody>
        <BaseBody variant="small">
          The quick brown fox jumps over the lazy dog
        </BaseBody>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Captions</BaseHeadline>
      <div>
        <BaseCaption variant="base"
          >The quick brown fox jumps over the lazy dog
        </BaseCaption>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Icons</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseIcon
          v-for="icon in icons"
          :name="icon"
          v-bind:key="icon"
          class="h-6 w-6"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBody from '#src/components/base/baseBody.vue';
import BaseCaption from '#src/components/base/baseCaption.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import type { IconName } from '#src/components/base/baseIcon.vue';
import BaseIcon from '#src/components/base/baseIcon.vue';

const icons: IconName[] = [
  'archiveBox',
  'arrowLeftStartOnRectangle',
  'arrowRightEndOnRectangle',
  'check',
  'chevronDoubleDown',
  'chevronDoubleRight',
  'clipboard',
  'clock',
  'commandLine',
  'crown',
  'cubeTransparent',
  'cursorArrowRays',
  'ellipsisVertical',
  'gear',
  'identification',
  'loading',
  'paperAirplane',
  'play',
  'rectangleGroup',
  'signal',
  'text',
  'xMark',
];
</script>
