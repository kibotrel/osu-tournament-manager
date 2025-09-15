<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="border-primary-3 w-1/4 rounded-md border-2 p-8">
      <h1 class="mb-8 text-center text-4xl font-semibold tracking-tight">
        Create new match
      </h1>
      <ui-input
        isRequired
        label="Room Name"
        placeholder="Enter the name of the room"
        v-model="matchName"
        @keydown.enter="createMatch(matchName)"
      />
      <div class="flex justify-center">
        <ui-button
          class="mt-8 w-32"
          @mousedown="createMatch(matchName)"
          @keydown.enter="createMatch(matchName)"
          :isLoading="isPending"
          >Create</ui-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useCreateMatch } from '#src/api/matchesApi.js';
import uiButton from '#src/components/ui/uiButton.vue';
import uiInput from '#src/components/ui/uiInput.vue';

const matchName = ref('');
const { mutate: createMatch, isPending } = useCreateMatch();
</script>
