<template>
  <component :is="isInline ? 'span' : 'p'" :class="`body body--${variant}`">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
export type BodyVariant = 'base' | 'small';

interface Properties {
  isInline?: boolean;
  variant?: BodyVariant;
}

withDefaults(defineProps<Properties>(), { isInline: false, variant: 'base' });
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.body {
  @apply font-normal tracking-normal;
}

.body--base {
  @apply text-base;
}

.body--small {
  @apply text-sm;
}
</style>
