<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="border-primary-3 w-1/4 rounded-md border-2 p-8 text-center">
      <h1 class="mb-2 text-4xl font-semibold tracking-tight">Welcome</h1>
      <p class="text-primary-2">
        To get access to this webapp, please login with your osu! account.
      </p>
      <ui-button
        @mousedown="redirectToOsuAuthPage()"
        :isLoading="isLoginButtonLoading"
        class="m-auto mt-8 w-32"
      >
        <template #default> Login </template>
        <template #icon>
          <ui-icon name="identification" />
        </template>
      </ui-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import uiButton from '#src/components/ui/uiButton.vue';
import uiIcon from '#src/components/ui/uiIcon.vue';

const baseUrl = import.meta.env.VITE_BASE_APP_URL;
const callbackUrl = encodeURIComponent(`${baseUrl}/oauth/callback`);
const clientId = import.meta.env.VITE_OSU_APPLICATION_CLIENT_ID;
const authUrl = `https://osu.ppy.sh/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${callbackUrl}&scope=identify+public`;
const isLoginButtonLoading = ref(false);

const redirectToOsuAuthPage = () => {
  isLoginButtonLoading.value = true;
  window.open(authUrl, '_self');
};
</script>
