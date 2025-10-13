<template>
  <component
    :is="properties.isInline ? 'span' : 'p'"
    :class="properties.variant"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
export type BodyVariant = 'base';

interface Properties {
  isInline?: boolean;
  variant?: BodyVariant;
}

const properties = withDefaults(defineProps<Properties>(), {
  isInline: false,
  variant: 'base',
});
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.base {
  @apply text-xs font-normal tracking-normal;
}
</style>
