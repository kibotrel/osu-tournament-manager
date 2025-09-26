<template>
  <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center">
    <LoadingIcon />
  </div>
  <div
    v-else-if="!match || match.endsAt"
    class="flex min-h-screen items-center justify-center"
  >
    <p>Match not found.</p>
  </div>
  <div
    v-else
    class="flex min-h-screen flex-col items-center justify-center gap-4"
  >
    <h1>Match {{ match.id }}</h1>
    <BaseButton
      id="show-close-match-modal-button"
      class="w-40"
      variant="primary"
      @mousedown="isModalOpen = true"
      @keydown.enter="isModalOpen = true"
    >
      <template #default> Close Match </template>
    </BaseButton>
    <CloseMatchModal
      :isModalOpen="isModalOpen"
      :matchId="match.id"
      :matchName="match.name"
      @close:modal="isModalOpen = false"
      @close:match="redirectToMatchCreationPage"
    />
  </div>
</template>
<script setup lang="ts">
import { inject, nextTick, ref } from 'vue';
import type { Router } from 'vue-router';
import { useRoute } from 'vue-router';

import { useGetMatch } from '#src/api/matchesApi.js';
import BaseButton from '#src/components/base/baseButton.vue';
import LoadingIcon from '#src/components/icons/loadingIcon.vue';

import CloseMatchModal from './components/closeMatchModal.vue';

const route = useRoute();
const router = inject<Router>('$router');
const matchId = Number(route.params.gameMatchId);
const isModalOpen = ref(false);
const { data: match, isLoading } = useGetMatch(matchId);

const redirectToMatchCreationPage = async () => {
  await nextTick();
  router?.push(`/matches/create`);
};
</script>
