<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <LoadingIcon />
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount } from 'vue';
import type { Router } from 'vue-router';

import { useLoginRequest } from '#src/api/authentication.api.js';
import LoadingIcon from '#src/components/icons/loading.icon.vue';

const $router = inject<Router>('$router');
const { mutateAsync: login } = useLoginRequest();

onBeforeMount(async () => {
  const [parameter, token] = globalThis.location.search.slice(1).split('=');

  if (parameter === 'code' && token) {
    return await login(token);
  }

  $router?.push('/login');
});
</script>
