<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">Buttons</BaseHeadline>
      <div class="flex flex-row space-x-2">
        <BaseButton class="w-32" id="button-primary" variant="primary">
          Primary
        </BaseButton>
        <BaseButton
          class="w-32"
          id="button-primary-with-icon"
          variant="primary"
        >
          With icon
          <template #icon>
            <BaseIcon name="cubeTransparent" />
          </template>
        </BaseButton>
        <BaseButton
          class="w-32"
          id="button-loading"
          isLoading
          variant="primary"
        />
        <BaseButton
          class="w-32"
          id="button-disabled"
          isDisabled
          variant="primary"
        >
          Disabled
        </BaseButton>
      </div>
      <div class="flex flex-row space-x-2">
        <BaseButton class="w-32" variant="secondary" id="button-secondary">
          Secondary
        </BaseButton>
        <BaseButton class="w-32" variant="ghost" id="button-ghost">
          Ghost
        </BaseButton>
        <BaseButton class="w-32" variant="success" id="button-success">
          Success
        </BaseButton>
        <BaseButton class="w-32" variant="warning" id="button-warning">
          Warning
        </BaseButton>
        <BaseButton class="w-32" variant="danger" id="button-danger">
          Danger
        </BaseButton>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Inputs</BaseHeadline>
      <div class="flex flex-row items-end space-x-2">
        <BaseInput
          id="string-input"
          label="Label"
          placeholder="String"
          v-model="stringInputValue"
        />
        <BaseInput
          id="number-input"
          label="Label"
          placeholder="Number"
          type="number"
          v-model="numberInputValue"
        />
        <BaseInput
          id="disabled-input"
          isDisabled
          label="Label"
          placeholder="Disabled"
        />
      </div>
      <div class="mt-4 flex flex-row space-x-2">
        <BaseInput
          errorMessage="Error message"
          id="error-input"
          label="Label"
          placeholder="Error"
          v-model="stringErrorValue"
        />
        <BaseInput
          id="required-input"
          isRequired
          label="Label"
          placeholder="Required"
          v-model="stringInputValue"
        />
        <BaseInput
          class="mt-6"
          id="no-label-input"
          placeholder="No label"
          v-model="stringInputValue"
        />
        <BaseInput
          class="mt-6"
          id="ghost-input"
          placeholder="Ghost"
          v-model="stringInputValue"
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

const stringInputValue = ref('');
const numberInputValue = ref('');
const stringErrorValue = ref('Wrong input');
</script>
