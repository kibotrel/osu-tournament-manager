<template>
  <div>
    <h1 class="bg-red-500">Home</h1>
    <p>Welcome to the home page! {{ placeholderStore.name }}</p>
    <input v-model="name" placeholder="Enter your name" />
    <button @click="placeholderStore.setName(name)">Set Name</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { usePlaceholderStore } from '#src/stores/placeholder.js';

const placeholderStore = usePlaceholderStore();
const name = ref('');
</script>

<style scoped></style>
