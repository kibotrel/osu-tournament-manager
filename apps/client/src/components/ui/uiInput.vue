<template>
  <div>
    <label v-if="properties.label" class="mb-1 block text-sm font-semibold">{{
      properties.label
    }}</label>
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
  </div>
</template>

<script setup lang="ts">
interface Properties {
  isDisabled?: boolean;
  errorMessage?: string;
  label?: string;
  disabled?: boolean;
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
  @apply border-primary-3 block w-full rounded-md border-2 px-4 py-2 text-base;
}

input:focus-visible {
  @apply ring-1 ring-yellow-400 outline-hidden;
}

input:disabled {
  @apply bg-primary-3 text-primary-2 cursor-not-allowed;
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
</style>
