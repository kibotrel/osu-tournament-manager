<template>
  <img
    :src="isError || !flagUrl ? UNKNOWN_COUNTRY_FLAG_URL : flagUrl"
    :alt="cleanCode"
    @error="handleImgError"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Properties {
  countryCode: string;
}

const UNKNOWN_COUNTRY_FLAG_URL = '/flags/unknown.png';
const properties = defineProps<Properties>();
const isError = ref(false);
const cleanCode = computed(() => {
  return properties.countryCode.trim().toUpperCase().slice(0, 2);
});
const flagUrl = computed(() => {
  return cleanCode.value.length === 2 ? `/flags/${cleanCode.value}.svg` : null;
});

const handleImgError = () => {
  isError.value = true;
};
</script>
