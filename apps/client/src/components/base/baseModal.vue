<template>
  <div
    class="fixed inset-0 z-10 flex items-center justify-center bg-black/50"
    @mousedown="emit('close')"
  >
    <div
      class="bg-primary-4 border-primary-3 relative w-1/3 rounded-md border-2 p-4"
      @mousedown.stop
    >
      <div>
        <x-mark-icon
          class="text-primary-1 hover:text-primary-1/90 active:text-primary-1/80 absolute right-0 mr-4 h-6 hover:cursor-pointer"
          @click="emit('close')"
        />
      </div>
      <div>
        <slot name="header"> </slot>
      </div>
      <div class="my-4">
        <slot name="body"> </slot>
      </div>
      <div>
        <slot name="footer"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import xMarkIcon from '#src/components/icons/xMarkIcon.vue';

const emit = defineEmits(['close']);
</script>

<style scoped></style>
