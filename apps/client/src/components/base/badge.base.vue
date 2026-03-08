<template>
  <BaseBody
    v-if="variant === 'base'"
    variant="small"
    :class="['badge badge--base', `badge--${color}`]"
    :is-inline
  >
    <div class="flex items-center justify-center gap-1 px-2">
      <BaseIcon
        v-if="icon?.side === 'left'"
        class="h-4 w-4"
        :name="icon.name"
      />
      <slot />
      <BaseIcon
        v-if="icon?.side === 'right'"
        class="h-4 w-4"
        :name="icon.name"
      />
    </div>
  </BaseBody>
  <BaseCaption
    v-else
    :class="['badge badge--small', `badge--${color}`]"
    :is-inline
  >
    <div class="flex items-center justify-center gap-1 px-2">
      <BaseIcon
        v-if="icon?.side === 'left'"
        class="h-3 w-3"
        :name="icon.name"
      />
      <slot />
      <BaseIcon
        v-if="icon?.side === 'right'"
        class="h-3 w-3"
        :name="icon.name"
      />
    </div>
  </BaseCaption>
</template>

<script setup lang="ts">
import BaseBody from './body.base.vue';
import BaseCaption from './caption.base.vue';
import type { IconName } from './icon.base.vue';
import BaseIcon from './icon.base.vue';

export type BadgeVariant = 'base' | 'small';
export type BadgeColor =
  | 'green'
  | 'none'
  | 'primary'
  | 'red'
  | 'secondary'
  | 'yellow';

interface Properties {
  icon?: { side: 'left' | 'right'; name: IconName } | null;
  color?: BadgeColor;
  isInline?: boolean;
  variant?: BadgeVariant;
}

withDefaults(defineProps<Properties>(), {
  icon: null,
  color: 'none',
  isInline: false,
  variant: 'base',
});
</script>

<style scoped>
@reference '#src/assets/styles/index.css';

.badge {
  @apply text-primary-1 flex items-center justify-center rounded-full border-2;
}

.badge--base {
  @apply py-1;
}

.badge--green {
  @apply bg-faded-green border-green-500;
}

.badge--primary {
  @apply border-primary-1 bg-faded-primary-1;
}

.badge--red {
  @apply bg-faded-red border-red-400;
}

.badge--secondary {
  @apply border-primary-3 bg-faded-primary-3;
}

.badge--small {
  @apply py-0.5;
}

.badge--yellow {
  @apply bg-faded-yellow border-yellow-400;
}
</style>
