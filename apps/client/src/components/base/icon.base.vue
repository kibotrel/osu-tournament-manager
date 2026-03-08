<template>
  <component :is="svgComponent()" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

export type IconName =
  | 'arrowLeftStartOnRectangle'
  | 'arrowPath'
  | 'arrowRightEndOnRectangle'
  | 'check'
  | 'checkCircle'
  | 'chevronDoubleDown'
  | 'chevronDoubleRight'
  | 'clipboard'
  | 'clock'
  | 'commandLine'
  | 'crown'
  | 'cubeTransparent'
  | 'cursorArrowRays'
  | 'ellipsisVertical'
  | 'exclamationCircle'
  | 'gear'
  | 'identification'
  | 'informationCircle'
  | 'language'
  | 'loading'
  | 'paperAirplane'
  | 'play'
  | 'rectangleGroup'
  | 'signal'
  | 'text'
  | 'xCircle'
  | 'xMark';

const properties = defineProps<{
  name: IconName;
}>();

const svgComponent = () => {
  return defineAsyncComponent(() => {
    return import(`#src/components/icons/${properties.name}.icon.vue`);
  });
};
</script>
