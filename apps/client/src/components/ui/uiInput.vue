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
      :disabled="properties.disabled"
      :placeholder="properties.placeholder"
      :value="modelValue"
      @input="handleInput"
      @keydown="blockInvalidNumberInput"
    />
    <input
      v-else
      :disabled="properties.disabled"
      :placeholder="properties.placeholder"
      :value="modelValue"
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
interface Properties {
  label?: string;
  disabled?: boolean;
  modelValue?: string;
  placeholder?: string;
  type?: 'text' | 'number';
}

const emit = defineEmits(['update:modelValue']);
const properties = withDefaults(defineProps<Properties>(), {
  disabled: false,
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
