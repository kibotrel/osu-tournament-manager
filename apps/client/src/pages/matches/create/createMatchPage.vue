<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="border-primary-3 w-1/4 rounded-md border-2 p-8">
      <BaseHeadline variant="hero" class="mb-8 text-center"
        >Create a new match
      </BaseHeadline>
      <BaseInput
        id="match-name"
        isRequired
        label="Match name"
        placeholder="MWC4K2025 RO32: Philippines VS France"
        v-model="matchName"
        @keydown.enter="handleCreateMatch"
      />
      <div class="flex justify-center">
        <BaseButton
          class="mt-8 w-32"
          id="create-match-button"
          variant="success"
          @mousedown="handleCreateMatch"
          @keydown.enter="handleCreateMatch"
          :isDisabled="matchName.length === 0"
          :isLoading="isPending || !isIdle"
        >
          <template #default> Create </template>
          <template #icon>
            <ArrowRightEndOnRectangleIcon />
          </template>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useCreateMatch } from '#src/api/matchesApi.js';
import BaseButton from '#src/components/base/baseButton.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseInput from '#src/components/base/baseInput.vue';
import ArrowRightEndOnRectangleIcon from '#src/components/icons/arrowRightEndOnRectangleIcon.vue';

const matchName = ref('');
const { mutate: createMatch, isPending, isIdle } = useCreateMatch();

const handleCreateMatch = () => {
  if (matchName.value.length === 0 || isPending.value) {
    return;
  }

  createMatch(matchName.value);
};
</script>
