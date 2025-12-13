<template>
  <BaseBody
    v-if="properties.variant === 'base'"
    :class="['badge badge--base', `badge--${properties.color}`]"
    variant="small"
    :isInline="properties.isInline"
  >
    <div class="flex items-center justify-center gap-1 px-2">
      <BaseIcon
        v-if="properties.icon && properties.icon.side === 'left'"
        :name="properties.icon.name"
        class="h-4 w-4"
      />
      <slot />
      <BaseIcon
        v-if="properties.icon && properties.icon.side === 'right'"
        :name="properties.icon.name"
        class="h-3 w-3"
      />
    </div>
  </BaseBody>
  <BaseCaption
    v-else
    :class="['badge badge--small', `badge--${properties.color}`]"
    :isInline="properties.isInline"
  >
    <div class="flex items-center justify-center gap-1 px-2">
      <BaseIcon
        v-if="properties.icon && properties.icon.side === 'left'"
        :name="properties.icon.name"
        class="h-3 w-3"
      />
      <slot />
      <BaseIcon
        v-if="properties.icon && properties.icon.side === 'right'"
        :name="properties.icon.name"
        class="h-3 w-3"
      />
    </div>
  </BaseCaption>
</template>

<script setup lang="ts">
import BaseBody from './baseBody.vue';
import BaseCaption from './baseCaption.vue';
import type { IconName } from './baseIcon.vue';
import BaseIcon from './baseIcon.vue';

export type BadgeVariant = 'base' | 'small';
export type BadgeColor = 'green' | 'primary' | 'red' | 'secondary' | 'yellow';

interface Properties {
  icon?: { side: 'left' | 'right'; name: IconName };
  color?: BadgeColor;
  isInline?: boolean;
  variant?: BadgeVariant;
}

const properties = withDefaults(defineProps<Properties>(), {
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

.badge--blue {
  @apply border-blue-500 bg-blue-500/50;
}

.badge--green {
  @apply border-green-500 bg-green-500/50;
}

.badge--primary {
  @apply border-primary-1 bg-primary-1/50;
}

.badge--red {
  @apply border-red-500 bg-red-500/50;
}

.badge--secondary {
  @apply border-primary-3 bg-primary-3/50;
}

.badge--small {
  @apply py-0.5;
}

.badge--yellow {
  @apply border-yellow-400 bg-yellow-400/50;
}
</style>
