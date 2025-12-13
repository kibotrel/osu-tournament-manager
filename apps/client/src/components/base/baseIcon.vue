<template>
  <component :is="svgComponent()" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

export type IconName =
  | 'arrowLeftStartOnRectangle'
  | 'arrowRightEndOnRectangle'
  | 'check'
  | 'chevronDoubleDown'
  | 'chevronDoubleRight'
  | 'clipboard'
  | 'clock'
  | 'commandLine'
  | 'crown'
  | 'cubeTransparent'
  | 'cursorArrowRays'
  | 'ellipsisVertical'
  | 'gear'
  | 'identification'
  | 'loading'
  | 'paperAirplane'
  | 'play'
  | 'rectangleGroup'
  | 'signal'
  | 'text'
  | 'xMark';

const properties = defineProps<{
  name: IconName;
}>();

const svgComponent = () => {
  return defineAsyncComponent(() => {
    return import(`#src/components/icons/${properties.name}Icon.vue`);
  });
};
</script>
