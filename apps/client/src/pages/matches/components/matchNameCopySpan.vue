<template>
  "<span
    :class="isSupported ? 'copy' : ''"
    @mousedown="copy(properties.matchName)"
    >{{ properties.matchName }}</span
  >"
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

interface Properties {
  matchName: string;
}

const properties = defineProps<Properties>();
const { copy, isSupported } = useClipboard({
  source: properties.matchName,
});
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.copy {
  @apply cursor-copy text-yellow-400 underline hover:text-yellow-400/80 active:text-yellow-400/60;
}
</style>
