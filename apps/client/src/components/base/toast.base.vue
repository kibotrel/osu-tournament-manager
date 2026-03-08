<template>
  <div :class="['toast', `toast--${variant}`]">
    <div
      :class="[
        'toast-icon-container',
        'toast-icon-container--left',
        `toast-icon-container--${variant}`,
      ]"
    >
      <BaseIcon :name="iconLookup[variant]"></BaseIcon>
    </div>
    <div :class="['toast-content', `toast-content--${variant}`]">
      <BaseCaption>{{ $t(`global.words.${variant}`) }}</BaseCaption>
      <BaseCaption>{{ message }}</BaseCaption>
    </div>
    <div
      :class="[
        'toast-icon-container toast-icon-container--right',
        `toast-icon-container--${variant}`,
      ]"
    >
      <BaseIcon
        name="xMark"
        tabindex="0"
        class="toast-icon"
        @mousedown="emit('close:toast')"
        @keydown.enter="emit('close:toast')"
      />
    </div>
    <div
      v-if="variant !== 'error'"
      :class="['progress-bar-container', `progress-bar-container--${variant}`]"
      :style="{ '--animation-duration': `${duration}ms` }"
      @animationend="emit('close:toast')"
    >
      <div :class="['progress-bar', `progress-bar--${variant}`]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseCaption from './caption.base.vue';
import type { IconName } from './icon.base.vue';
import BaseIcon from './icon.base.vue';

export type ToastVariant = 'error' | 'info' | 'success' | 'warning';

interface Properties {
  duration: number;
  message: string;
  variant: ToastVariant;
}

const iconLookup: Record<ToastVariant, IconName> = {
  error: 'xCircle',
  info: 'informationCircle',
  success: 'checkCircle',
  warning: 'exclamationCircle',
};

defineProps<Properties>();

const emit = defineEmits(['close:toast']);
</script>

<style>
@reference '#src/assets/styles/index.css';

.toast {
  @apply grid grid-cols-[2.5rem_1fr_2rem] gap-0 overflow-hidden rounded-md border-2;

  /* Prevent an anti-aliasing issue between the content content and the right icon columns */
  & > div:nth-child(2) {
    margin-right: -1px;
  }

  &:hover .progress-bar,
  &:focus-within .progress-bar {
    animation-play-state: paused;
  }
}

.toast-icon {
  @apply rounded-md;

  &:focus-visible {
    @apply ring-2 ring-yellow-400 outline-hidden;
  }

  &:focus:not(:focus-visible) {
    @apply ring-0 outline-hidden;
  }
}

.toast--error {
  @apply border-red-500 bg-red-500;
}

.toast--info {
  @apply border-blue-500 bg-blue-500;
}

.toast--success {
  @apply border-green-500 bg-green-500;
}

.toast--warning {
  @apply border-yellow-500 bg-yellow-500;
}

.toast-content {
  @apply flex flex-col justify-center space-y-1 rounded-tl-sm p-2;
}

.toast-content--error {
  @apply bg-faded-red;
}

.toast-content--info {
  @apply bg-faded-blue;
}

.toast-content--success {
  @apply bg-faded-green;
}

.toast-content--warning {
  @apply bg-faded-yellow;
}

.toast-icon-container {
  @apply text-primary-1 flex;
}

.toast-icon-container--right {
  @apply bg-primary-4 text-primary-1 z-1000 cursor-pointer rounded-tr-sm py-2 pr-2;

  &.toast-icon-container--error {
    @apply bg-faded-red;
  }

  &.toast-icon-container--info {
    @apply bg-faded-blue;
  }

  &.toast-icon-container--success {
    @apply bg-faded-green;
  }

  &.toast-icon-container--warning {
    @apply bg-faded-yellow text-primary-1;
  }
}

.toast-icon-container--left {
  @apply row-span-2 items-center justify-center p-2;
}

.toast-icon-container--error {
  @apply bg-red-500;
}

.toast-icon-container--info {
  @apply bg-blue-500;
}

.toast-icon-container--success {
  @apply bg-green-500;
}

.toast-icon-container--warning {
  @apply text-primary-4 bg-yellow-500;
}

@keyframes shrink-width {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

.progress-bar-container {
  @apply col-span-2 col-start-2 h-1 w-full;
  contain: content;
}

.progress-bar-container--error {
  @apply bg-faded-red;
}

.progress-bar-container--info {
  @apply bg-faded-blue;
}

.progress-bar-container--success {
  @apply bg-faded-green;
}

.progress-bar-container--warning {
  @apply bg-faded-yellow;
}

.progress-bar {
  @apply pointer-events-none h-full w-full;

  animation: shrink-width linear var(--animation-duration);
}

.progress-bar--error {
  @apply bg-red-500;
}

.progress-bar--info {
  @apply bg-blue-500;
}

.progress-bar--success {
  @apply bg-green-500;
}

.progress-bar--warning {
  @apply bg-yellow-500;
}
</style>
