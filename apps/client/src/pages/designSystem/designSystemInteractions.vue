<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">
        {{ $t('pages.designSystem.tabs.interaction.words.button') }}
      </BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton id="button-primary" class="w-32" variant="primary">
          {{ $t('pages.designSystem.words.primary') }}
        </BaseButton>
        <BaseButton
          id="button-primary-with-icon"
          class="w-32"
          variant="primary"
        >
          {{ $t('pages.designSystem.words.icon') }}
          <template #icon>
            <BaseIcon name="cubeTransparent" />
          </template>
        </BaseButton>
        <BaseButton
          id="button-loading"
          class="w-32"
          is-loading
          variant="primary"
        />
        <BaseButton
          id="button-disabled"
          class="w-32"
          is-disabled
          variant="primary"
        >
          {{ $t('pages.designSystem.tabs.interaction.words.disabled') }}
        </BaseButton>
      </div>
      <div class="flex flex-row space-x-2">
        <BaseButton id="button-secondary" class="w-32" variant="secondary">
          {{ $t('pages.designSystem.words.secondary') }}
        </BaseButton>
        <BaseButton id="button-ghost" class="w-32" variant="ghost">
          {{ $t('pages.designSystem.tabs.interaction.words.ghost') }}
        </BaseButton>
        <BaseButton id="button-success" class="w-32" variant="success">
          {{ $t('pages.designSystem.tabs.interaction.words.success') }}
        </BaseButton>
        <BaseButton id="button-warning" class="w-32" variant="warning">
          {{ $t('pages.designSystem.tabs.interaction.words.warning') }}
        </BaseButton>
        <BaseButton id="button-danger" class="w-32" variant="danger">
          {{ $t('pages.designSystem.tabs.interaction.words.danger') }}
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">
        {{ $t('pages.designSystem.tabs.interaction.words.input') }}
      </BaseHeadline>
      <div class="flex flex-row items-end space-x-2">
        <BaseInput
          id="string-input"
          v-model="stringInputValue"
          :label="$t('pages.designSystem.tabs.interaction.words.label')"
          :placeholder="$t('pages.designSystem.tabs.interaction.words.text')"
        />
        <BaseInput
          id="number-input"
          v-model="numberInputValue"
          type="number"
          :label="$t('pages.designSystem.tabs.interaction.words.label')"
          :placeholder="$t('pages.designSystem.tabs.interaction.words.number')"
        />
        <BaseInput
          id="disabled-input"
          v-model="disabledStringInputValue"
          is-disabled
          :label="$t('pages.designSystem.tabs.interaction.words.label')"
          :placeholder="
            $t('pages.designSystem.tabs.interaction.words.disabled')
          "
        />
      </div>
      <div class="mt-4 flex flex-row space-x-2">
        <BaseInput
          id="error-input"
          v-model="stringErrorValue"
          :error-message="
            $t('pages.designSystem.tabs.interaction.words.errorMessage')
          "
          :placeholder="$t('pages.designSystem.tabs.interaction.words.error')"
          :label="$t('pages.designSystem.tabs.interaction.words.label')"
        />
        <BaseInput
          id="required-input"
          v-model="stringInputValue"
          is-required
          :placeholder="
            $t('pages.designSystem.tabs.interaction.words.required')
          "
          :label="$t('pages.designSystem.tabs.interaction.words.label')"
        />
        <BaseInput
          id="no-label-input"
          v-model="stringInputValue"
          class="mt-6"
          :placeholder="$t('pages.designSystem.tabs.interaction.words.noLabel')"
        />
        <BaseInput
          id="ghost-input"
          v-model="stringInputValue"
          class="mt-6"
          variant="ghost"
          :placeholder="$t('pages.designSystem.tabs.interaction.words.ghost')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { ref } from 'vue';

import BaseButton from '#src/components/base/baseButton.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseIcon from '#src/components/base/baseIcon.vue';
import BaseInput from '#src/components/base/baseInput.vue';

const { t } = useTranslation();
const disabledStringInputValue = ref('');
const numberInputValue = ref('');
const stringErrorValue = ref(
  t('pages.designSystem.tabs.interaction.words.wrongInput'),
);
const stringInputValue = ref('');
</script>
