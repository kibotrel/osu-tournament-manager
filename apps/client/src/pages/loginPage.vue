<template>
  <div
    class="mx-auto my-72 flex w-[90%] flex-col items-center justify-center rounded-lg border-1 border-primary-3 p-8 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3"
  >
    <div class="w-full text-center">
      <h1 class="mb-2 text-4xl font-semibold tracking-tight">Login</h1>
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
