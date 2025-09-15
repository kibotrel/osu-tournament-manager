<template>
  <component :is="svgComponent()" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

export type IconNames =
  | 'archive'
  | 'identification'
  | 'leave'
  | 'loading'
  | 'transparentCube';

const properties = defineProps<{
  name: IconNames;
}>();

const svgComponent = () => {
  return defineAsyncComponent(() => {
    return import(`#src/components/icons/${properties.name}Icon.vue`);
  });
};
</script>
