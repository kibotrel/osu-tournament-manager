<template>
  <component :is="isInline ? 'span' : 'p'" :class="variant">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
export type CaptionVariant = 'base';

interface Properties {
  isInline?: boolean;
  variant?: CaptionVariant;
}

withDefaults(defineProps<Properties>(), { isInline: false, variant: 'base' });
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.base {
  @apply text-xs font-normal tracking-normal text-balance;
}
</style>
