<template>
  <hr :class="properties.variant" />
</template>

<script setup lang="ts">
type SeparatorVariant = 'dashed' | 'primary';

interface Properties {
  variant?: SeparatorVariant;
}

const properties = withDefaults(defineProps<Properties>(), {
  variant: 'primary',
});
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

hr {
  @apply border-primary-3 border-b-1;
}

.dashed {
  @apply border-dashed;
}
</style>
