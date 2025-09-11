<template>
  <div></div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount } from 'vue';
import type { Router } from 'vue-router';

import { usePostPublicLogin } from '#src/api/authenticationApi.js';

const $router = inject<Router>('$router');
const { mutateAsync: login } = usePostPublicLogin();

onBeforeMount(async () => {
  const [parameter, token] = window.location.search.slice(1).split('=');

  if (parameter === 'code' && token) {
    return await login(token);
  }

  $router?.push('/login');
});
</script>
