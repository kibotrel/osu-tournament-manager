<template>
  <component :class="variant" :is="variant === 'subtitle' ? 'h2' : 'h1'">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
export type HeadlineVariant = 'hero' | 'subtitle' | 'title';

interface Properties {
  variant?: HeadlineVariant;
}

withDefaults(defineProps<Properties>(), { variant: 'title' });
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.hero {
  @apply text-4xl font-bold tracking-tighter;
}

.title {
  @apply text-2xl font-semibold tracking-tight;
}

.subtitle {
  @apply text-xl tracking-tight;
}
</style>
