<template>
  <component
    :class="properties.variant"
    :is="properties.isInline ? 'span' : 'p'"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
export type BodyVariant = 'base' | 'small';

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
  @apply text-base font-normal tracking-normal;
}

.small {
  @apply text-sm font-normal tracking-normal;
}
</style>
