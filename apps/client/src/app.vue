<template>
  <div class="flex min-h-full flex-col">
    <RouterView class="flex-1" />
    <ToastProvider />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import ToastProvider from './components/providers/toast.provider.vue';
</script>

<style scoped></style>
