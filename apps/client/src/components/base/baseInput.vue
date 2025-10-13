<template>
  <div v-bind="$attrs" :class="[$attrs.class, 'min-w-0']">
    <label
      v-if="properties.label"
      :class="[
        'mb-1 block text-sm',
        !properties.isDisabled && properties.errorMessage ? 'error' : '',
      ]"
      :for="properties.id"
    >
      <BaseBody variant="small" isInline class="font-semibold!">
        {{ properties.label }}
      </BaseBody>
      <BaseBody
        v-if="properties.isRequired"
        isInline
        variant="small"
        class="text-red-400"
      >
        *
      </BaseBody>
    </label>
    <input
      v-if="properties.type === 'number'"
      inputmode="numeric"
      min="0"
      type="number"
      :class="[properties.errorMessage ? 'error' : '', properties.variant]"
      :disabled="properties.isDisabled"
      :id="properties.id"
      :autocomplete="properties.doAutoComplete ? 'on' : 'off'"
      :placeholder="properties.placeholder"
      :value="modelValue"
      @blur="emit('blur')"
      @input="handleInput"
      @keydown="blockInvalidNumberInput"
    />
    <input
      v-else
      :class="[properties.errorMessage ? 'error' : '', properties.variant]"
      :disabled="properties.isDisabled"
      :id="properties.id"
      :autocomplete="properties.doAutoComplete ? 'on' : 'off'"
      :placeholder="properties.placeholder"
      :value="modelValue"
      @blur="emit('blur')"
      @input="handleInput"
    />
    <div v-if="properties.errorMessage" class="mt-1 flex flex-row">
      <BaseBody variant="small" class="text-red-400">
        {{ properties.errorMessage }}
      </BaseBody>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBody from './baseBody.vue';

export type InputVariant = 'ghost' | 'primary';

interface Properties {
  id: string;
  doAutoComplete?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
  modelValue?: string;
  placeholder?: string;
  type?: 'text' | 'number';
  variant?: InputVariant;
}

const emit = defineEmits(['blur', 'update:modelValue']);
const properties = withDefaults(defineProps<Properties>(), {
  doAutoComplete: false,
  isDisabled: false,
  isRequired: false,
  placeholder: '',
  type: 'text',
  variant: 'primary',
});

const handleInput = (event: Event) => {
  const { value } = event.target as HTMLInputElement;

  emit('update:modelValue', value);
};

const blockInvalidNumberInput = (event: KeyboardEvent) => {
  if (/^[+Ee-]$/.test(event.key)) {
    event.preventDefault();
  }
};
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

input {
  @apply block w-full rounded-md border-2 border-transparent p-2 text-base;
}

input:focus,
input:focus-visible {
  @apply outline-none;
}

input:focus-visible:not(.ghost) {
  @apply ring-1 ring-yellow-400 outline-hidden;
}

input:disabled {
  @apply border-primary-3 bg-primary-3 text-primary-2 cursor-not-allowed;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
  margin: 0;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input.error:not(:disabled) {
  @apply border-red-400 bg-red-400/20 text-red-400;
}

.primary {
  @apply border-primary-3;
}

.ghost {
  @apply rounded-none;
}
</style>
