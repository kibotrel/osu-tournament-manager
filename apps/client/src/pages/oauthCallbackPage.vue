<template>
  <div class="fixed inset-0 flex items-center justify-center">
    <LoadingIcon />
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount } from 'vue';
import type { Router } from 'vue-router';

import { useLogin } from '#src/api/authenticationApi.js';
import LoadingIcon from '#src/components/icons/loadingIcon.vue';

const $router = inject<Router>('$router');
const { mutateAsync: login } = useLogin();

onBeforeMount(async () => {
  const [parameter, token] = window.location.search.slice(1).split('=');

  if (parameter === 'code' && token) {
    return await login(token);
  }

  $router?.push('/login');
});
</script>
