<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="border-primary-3 w-1/4 rounded-md border-2 p-8 text-center">
      <BaseHeadline class="mb-2" variant="hero">
        {{ $t('pages.login.title') }}
      </BaseHeadline>
      <BaseBody class="text-primary-2">
        {{ $t('pages.login.howToAccess') }}
      </BaseBody>
      <BaseButton
        id="login-button"
        class="m-auto mt-8 w-32"
        :is-loading="isLoginButtonLoading"
        @keydown.enter="redirectToOsuAuthPage()"
        @mousedown="redirectToOsuAuthPage()"
      >
        <template #default> {{ $t('pages.login.buttons.login') }} </template>
        <template #icon>
          <IdentificationIcon class="text-primary-4 h-6 w-6" />
        </template>
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { BASE_URL, OSU_APPLICATION_CLIENT_ID } from '#src/api/api.constants.js';
import BaseBody from '#src/components/base/body.base.vue';
import BaseButton from '#src/components/base/button.base.vue';
import BaseHeadline from '#src/components/base/headline.base.vue';
import IdentificationIcon from '#src/components/icons/identification.icon.vue';

const callbackUrl = encodeURIComponent(`${BASE_URL}/oauth/callback`);
const authUrl = `https://osu.ppy.sh/oauth/authorize?client_id=${OSU_APPLICATION_CLIENT_ID}&response_type=code&redirect_uri=${callbackUrl}&scope=identify+public`;
const isLoginButtonLoading = ref(false);

const redirectToOsuAuthPage = () => {
  isLoginButtonLoading.value = true;
  window.open(authUrl, '_self');
};
</script>
