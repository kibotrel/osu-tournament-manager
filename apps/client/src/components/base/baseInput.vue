<template>
  <div>
    <label
      v-if="properties.label"
      :class="!properties.isDisabled && properties.errorMessage ? 'error' : ''"
    >
      <span>
        {{ properties.label }}
      </span>
      <span v-if="properties.isRequired" class="text-red-400"> * </span>
    </label>
    <input
      v-if="properties.type === 'number'"
      inputmode="numeric"
      min="0"
      type="number"
      :class="properties.errorMessage ? 'error' : ''"
      :disabled="properties.isDisabled"
      :placeholder="properties.placeholder"
      :value="modelValue"
      @blur="emit('blur')"
      @input="handleInput"
      @keydown="blockInvalidNumberInput"
    />
    <input
      v-else
      :class="properties.errorMessage ? 'error' : ''"
      :disabled="properties.isDisabled"
      :placeholder="properties.placeholder"
      :value="modelValue"
      @blur="emit('blur')"
      @input="handleInput"
    />
    <div
      v-if="properties.errorMessage"
      class="mt-1 flex flex-row text-sm text-red-400"
    >
      <span>
        {{ properties.errorMessage }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Properties {
  isDisabled?: boolean;
  errorMessage?: string;
  label?: string;
  modelValue?: string;
  placeholder?: string;
  isRequired?: boolean;
  type?: 'text' | 'number';
}

const emit = defineEmits(['blur', 'update:modelValue']);
const properties = withDefaults(defineProps<Properties>(), {
  isDisabled: false,
  isRequired: false,
  placeholder: '',
  type: 'text',
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
  @apply border-primary-3 block w-full rounded-md border-2 p-2 text-base;
}

input:focus-visible {
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

label {
  @apply mb-1 block text-sm font-semibold;
}

input.error:not(:disabled) {
  @apply border-red-400 bg-red-400/20 text-red-400;
}
</style>
