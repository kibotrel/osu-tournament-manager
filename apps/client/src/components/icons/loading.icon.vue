<template>
  <svg viewBox="0 0 40 40" height="40" width="40" overflow="visible">
    <circle
      cx="20"
      cy="20"
      fill="none"
      opacity="0.25"
      path-length="100"
      r="17.5"
      stroke="currentColor"
      :stroke-width
    />
    <circle
      cx="20"
      cy="20"
      fill="none"
      path-length="100"
      r="17.5"
      stroke="currentColor"
      stroke-dasharray="25, 75"
      stroke-dashoffset="0"
      stroke-linecap="round"
      :stroke-width
    />
  </svg>
</template>

<script setup lang="ts">
interface Properties {
  strokeWidth?: string;
}

withDefaults(defineProps<Properties>(), {
  strokeWidth: '3px',
});
</script>

<style scoped>
svg {
  animation: rotate 0.8s linear infinite;
}

circle {
  transition: stroke 0.5s ease;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
