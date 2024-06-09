<template>
  <div class="m-4">
    <p>Welcome {{ username }} ({{ gameUserId }}). Login: {{ isLoggedIn }}</p>
    <ui-button @mousedown="logout">Logout</ui-button>
  </div>
</template>

<script setup lang="ts">
import uiButton from '#src/components/ui/uiButton.vue';
import { useUserStore } from '#src/stores/userStore.js';

const { gameUserId, username, isLoggedIn, logout } = useUserStore();
</script>

<style scoped></style>
