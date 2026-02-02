<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">Buttons</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton id="button-primary" class="w-32" variant="primary">
          Primary
        </BaseButton>
        <BaseButton
          id="button-primary-with-icon"
          class="w-32"
          variant="primary"
        >
          With icon
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
          Disabled
        </BaseButton>
      </div>
      <div class="flex flex-row space-x-2">
        <BaseButton id="button-secondary" class="w-32" variant="secondary">
          Secondary
        </BaseButton>
        <BaseButton id="button-ghost" class="w-32" variant="ghost">
          Ghost
        </BaseButton>
        <BaseButton id="button-success" class="w-32" variant="success">
          Success
        </BaseButton>
        <BaseButton id="button-warning" class="w-32" variant="warning">
          Warning
        </BaseButton>
        <BaseButton id="button-danger" class="w-32" variant="danger">
          Danger
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Inputs</BaseHeadline>
      <div class="flex flex-row items-end space-x-2">
        <BaseInput
          id="string-input"
          v-model="stringInputValue"
          label="Label"
          placeholder="String"
        />
        <BaseInput
          id="number-input"
          v-model="numberInputValue"
          label="Label"
          placeholder="Number"
          type="number"
        />
        <BaseInput
          id="disabled-input"
          v-model="disabledStringInputValue"
          is-disabled
          label="Label"
          placeholder="Disabled"
        />
      </div>
      <div class="mt-4 flex flex-row space-x-2">
        <BaseInput
          id="error-input"
          v-model="stringErrorValue"
          error-message="Error message"
          label="Label"
          placeholder="Error"
        />
        <BaseInput
          id="required-input"
          v-model="stringInputValue"
          is-required
          label="Label"
          placeholder="Required"
        />
        <BaseInput
          id="no-label-input"
          v-model="stringInputValue"
          class="mt-6"
          placeholder="No label"
        />
        <BaseInput
          id="ghost-input"
          v-model="stringInputValue"
          class="mt-6"
          placeholder="Ghost"
          variant="ghost"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseButton from '#src/components/base/baseButton.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseIcon from '#src/components/base/baseIcon.vue';
import BaseInput from '#src/components/base/baseInput.vue';

const disabledStringInputValue = ref('');
const numberInputValue = ref('');
const stringErrorValue = ref('Wrong input');
const stringInputValue = ref('');
</script>
