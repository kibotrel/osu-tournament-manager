<template>
  <div>
    <div class="m-4 flex flex-row items-center gap-2">
      <p>
        {{ $t('pages.login.title') }} {{ user.name }} ({{ user.gameUserId }}).
        Login:
        {{ user.isLoggedIn }}
      </p>
    </div>
    <div class="m-4 flex flex-row items-center gap-2">
      <BaseButton
        id="logout-button"
        class="w-24"
        :is-loading="isPending"
        @mousedown="logout"
      >
        Logout
      </BaseButton>
      <BaseDropdown dropdown-icon="language" :items="languageDropdownItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { computed } from 'vue';

import { useLogout } from '#src/api/authenticationApi.js';
import BaseButton from '#src/components/base/baseButton.vue';
import type { DropdownItem } from '#src/components/base/baseDropdown.vue';
import BaseDropdown from '#src/components/base/baseDropdown.vue';
import { useUserStore } from '#src/stores/userStore.js';

const { i18next, t } = useTranslation();
const languageDropdownItems = computed<DropdownItem[]>(() => {
  return [
    {
      countryCode: 'gb',
      id: 'language-en',
      label: t('global.languages.english'),
      onSelect: () => {
        return i18next.changeLanguage('en');
      },
    },
    {
      countryCode: 'fr',
      id: 'language-fr',
      label: t('global.languages.french'),
      onSelect: () => {
        return i18next.changeLanguage('fr');
      },
    },
  ];
});
const { isPending, mutate: logout } = useLogout();
const { user } = useUserStore();
</script>
