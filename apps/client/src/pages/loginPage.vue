<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="border-primary-3 w-1/4 rounded-md border-2 p-8 text-center">
      <BaseHeadline class="mb-2" variant="hero">Welcome</BaseHeadline>
      <BaseBody class="text-primary-2">
        To get access to this webapp, please login with your osu! account.
      </BaseBody>
      <BaseButton
        id="login-button"
        class="m-auto mt-8 w-32"
        :is-loading="isLoginButtonLoading"
        @keydown.enter="redirectToOsuAuthPage()"
        @mousedown="redirectToOsuAuthPage()"
      >
        <template #default> Login </template>
        <template #icon>
          <IdentificationIcon class="text-primary-4 h-6 w-6" />
        </template>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseBody from '#src/components/base/baseBody.vue';
import BaseButton from '#src/components/base/baseButton.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import IdentificationIcon from '#src/components/icons/identificationIcon.vue';

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
