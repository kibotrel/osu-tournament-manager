<template>
  <div></div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount } from 'vue';
import type { Router } from 'vue-router';

import { useUserStore } from '#src/stores/userStore.js';

const $router = inject<Router>('$router');
const { login } = useUserStore();

onBeforeMount(() => {
  const [parameter, token] = window.location.search.slice(1).split('=');

  if (parameter === 'code' && token) {
    return login(token);
  }

  $router?.push('/login');
});
</script>

<style scoped></style>
