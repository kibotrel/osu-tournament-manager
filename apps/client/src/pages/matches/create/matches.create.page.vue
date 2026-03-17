<template>
  <div class="flex min-h-screen items-center justify-center">
    <div
      class="border-primary-3 w-[calc(100%-32px)] rounded-md border-2 p-8 sm:w-2/3 lg:w-1/2 xl:w-2/5 2xl:w-1/3"
    >
      <BaseHeadline variant="hero" class="mb-8 text-center"
        >{{ $t('pages.createMatch.title') }}
      </BaseHeadline>
      <BaseInput
        id="match-name"
        v-model="matchName"
        is-required
        :label="$t('global.words.name')"
        :placeholder="$t('pages.createMatch.form.name.placeholder')"
        @keydown.enter="handleCreateMatch"
      />
      <div class="flex justify-center">
        <BaseButton
          id="create-match-button"
          class="mt-8 w-32"
          variant="success"
          :is-disabled="matchName.length === 0"
          :is-loading="isPending || !isIdle"
          @keydown.enter="handleCreateMatch"
          @mousedown="handleCreateMatch"
        >
          <template #default> {{ $t('global.words.create') }} </template>
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

import { useCreateMatchRequest } from '#src/api/matches.api.js';
import BaseButton from '#src/components/base/button.base.vue';
import BaseHeadline from '#src/components/base/headline.base.vue';
import BaseInput from '#src/components/base/input.base.vue';
import ArrowRightEndOnRectangleIcon from '#src/components/icons/arrowRightEndOnRectangle.icon.vue';

const matchName = ref('');
const { mutate: createMatch, isPending, isIdle } = useCreateMatchRequest();

const handleCreateMatch = () => {
  if (matchName.value.length === 0 || isPending.value) {
    return;
  }

  createMatch(matchName.value);
};
</script>
