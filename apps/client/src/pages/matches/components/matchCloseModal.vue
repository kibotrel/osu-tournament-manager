<template>
  <BaseModal
    id="close-match-modal"
    :is-modal-open
    @close:modal="emit('close:modal')"
  >
    <template #header>
      <BaseHeadline class="mb-4">Close match</BaseHeadline>
    </template>
    <template #body>
      <div class="space-y-2">
        <BaseBody>
          You are about to close the match
          <MatchNameCopy :match-name="matchName" />. This action cannot be
          undone. To confirm, please type the match name exactly as shown above.
        </BaseBody>
        <BaseInput
          id="match-name-confirmation"
          v-model="confirmationMatchName"
          placeholder="MWC4K2025 RO32: Philippines VS France"
          @keydown.enter="handleCloseMatch"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row justify-end">
        <BaseButton
          id="close-match-button"
          class="w-32"
          variant="danger"
          :is-loading="isPending"
          :is-disabled="matchName !== confirmationMatchName"
          @keydown.enter="handleCloseMatch"
          @mousedown="handleCloseMatch"
        >
          <template #default> Close </template>
          <template #icon>
            <BaseIcon name="arrowLeftStartOnRectangle" />
          </template>
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { useCloseMatch } from '#src/api/matchesApi.js';
import BaseBody from '#src/components/base/baseBody.vue';
import BaseButton from '#src/components/base/baseButton.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseIcon from '#src/components/base/baseIcon.vue';
import BaseInput from '#src/components/base/baseInput.vue';
import BaseModal from '#src/components/base/baseModal.vue';

import MatchNameCopy from './matchNameCopy.vue';

interface Properties {
  isModalOpen: boolean;
  matchId: number;
  matchName: string;
}

const emit = defineEmits(['close:modal', 'close:match']);
const properties = defineProps<Properties>();
const { mutate: closeMatch, isPending } = useCloseMatch();
const confirmationMatchName = ref('');

const handleCloseMatch = () => {
  if (properties.matchName !== confirmationMatchName.value || isPending.value) {
    return;
  }

  closeMatch(properties.matchId, {
    onSuccess: () => {
      // TODO: Toaster here to indicate close or deletion depending on how far match went.
      emit('close:match');
    },
  });
};
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.copy {
  @apply cursor-copy text-yellow-400 underline;
  @apply hover:text-yellow-400/80;
  @apply active:text-yellow-400/60;
}
</style>
