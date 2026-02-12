<template>
  <a target="_blank" :href="link" :rel="relation">
    <slot> {{ $t('global.words.link') }} </slot>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Properties {
  isExternal?: boolean;
  link: string;
}

const properties = defineProps<Properties>();
const relation = computed(() => {
  const baseRelations = ['noopener', 'noreferrer'];

  if (properties.isExternal) {
    baseRelations.push('external');
  }

  return baseRelations.join(' ');
});
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

a {
  @apply text-yellow-400 underline ring-0 ring-yellow-400 outline-none;
}

a:focus-visible {
  @apply rounded-md ring-2 ring-yellow-400 outline-hidden;
}

a:hover {
  @apply text-yellow-400/80;
}
</style>
