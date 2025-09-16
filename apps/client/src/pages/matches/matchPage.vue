<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4">
    <h1>Match {{ matchId }}</h1>
    <BaseButton
      class="w-40"
      variant="danger"
      :isLoading="isPending"
      @mousedown="closeMatch(matchId)"
      @keydown.enter="closeMatch(matchId)"
    >
      <template #default> Close Match </template>
      <template #icon>
        <LeaveIcon />
      </template>
    </BaseButton>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useCloseMatch } from '#src/api/matchesApi.js';
import BaseButton from '#src/components/base/baseButton.vue';
import LeaveIcon from '#src/components/icons/leaveIcon.vue';

const route = useRoute();
const matchId = Number(route.params.gameMatchId);
const { mutate: closeMatch, isPending } = useCloseMatch();
</script>
