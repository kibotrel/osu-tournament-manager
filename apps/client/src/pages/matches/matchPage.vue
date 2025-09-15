<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1>Match {{ matchId }}</h1>
    <ui-button
      class="w-40"
      variant="danger"
      :isLoading="isPending"
      @mousedown="closeMatch(matchId)"
    >
      <template #default>Close Match</template>
      <template #icon><archive-icon /></template>
    </ui-button>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useCloseMatch } from '#src/api/matchesApi.js';
import archiveIcon from '#src/components/icons/archiveIcon.vue';
import uiButton from '#src/components/ui/uiButton.vue';

const route = useRoute();
const matchId = Number(route.params.gameMatchId);
const { mutate: closeMatch, isPending } = useCloseMatch();
</script>
