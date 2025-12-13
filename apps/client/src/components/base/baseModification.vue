<template>
  <div class="container inline-grid h-8 w-8 place-items-center">
    <svg
      :class="['col-start-1 row-start-1', getModificationBackgroundColor()]"
      viewBox="0 0 100 70"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M25.5678 70C25.1561 69.9742 24.7572 69.9742 24.3455 69.9354C23.535 69.8579 22.7244 69.7029 21.9396 69.4704C20.7688 69.1216 19.6367 68.6049 18.6074 67.9461C17.5781 67.2873 16.6389 66.4735 15.8412 65.5435C15.1336 64.7167 15.005 64.4584 14.426 63.5412L1.72742 41.4523C1.22565 40.4835 1.07126 40.251 0.71102 39.2176C0.31218 38.055 0.0805947 36.8407 0.0162656 35.6136C-0.0480635 34.3864 0.0805947 33.1463 0.363643 31.9579C0.55663 31.157 0.826813 30.382 1.16132 29.6328C1.32858 29.2582 1.53443 28.9094 1.72742 28.5348L14.426 6.45876C15.0178 5.54161 15.1336 5.28326 15.8412 4.45654C16.6389 3.52648 17.5781 2.71268 18.6074 2.05388C19.6367 1.39509 20.7688 0.878391 21.9396 0.529618C22.7244 0.297103 23.5221 0.142093 24.3455 0.0645876C24.7572 0.025835 25.1561 0.025835 25.5678 0H74.4451C75.5258 0.05167 75.8088 0.025835 76.8767 0.232515C78.0861 0.46503 79.244 0.865473 80.3376 1.43384C81.4312 2.00221 82.4347 2.71268 83.3225 3.56523C83.9143 4.1336 84.4547 4.75364 84.9179 5.42535C85.1494 5.76121 85.3553 6.10998 85.574 6.45876L98.2726 28.5348C98.4656 28.8965 98.6586 29.2582 98.8387 29.6328C99.1732 30.382 99.4434 31.157 99.6364 31.9579C99.9194 33.1593 100.048 34.3864 99.9837 35.6136C99.9194 36.8407 99.6878 38.0679 99.289 39.2176C98.9287 40.251 98.7743 40.4835 98.2726 41.4523L85.574 63.5283C84.9822 64.4455 84.8664 64.7038 84.1588 65.5305C83.3611 66.4606 82.4219 67.2744 81.3926 67.9332C80.3633 68.592 79.2312 69.1087 78.0604 69.4575C77.2756 69.69 76.4779 69.845 75.6545 69.9225C75.2428 69.9612 74.8439 69.9612 74.4322 69.9871C58.1569 70 41.8559 70 25.5678 70Z"
      />
      <clipPath>
        <rect width="100" height="69.7157" />
      </clipPath>
    </svg>
    <component
      :is="modificationComponent()"
      :mod="properties.mod"
      :class="[
        'col-start-1 row-start-1 h-8 w-8',
        getModificationForegroundColor(),
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, defineComponent, h } from 'vue';

const baseMods = ['NM'];
const increaseDifficultyMods = ['DT', 'FI', 'FL', 'HD', 'HR', 'NC', 'PF', 'SD'];
const maniaMods = ['4K', '5K', '6K', '7K', '8K', '9K', 'MR'];
const decreaseDifficultyMods = ['EZ', 'HT', 'NF'];
const standardMods = ['RX', 'SO'];
const mods = [
  ...decreaseDifficultyMods,
  ...increaseDifficultyMods,
  ...baseMods,
  ...maniaMods,
  ...standardMods,
] as const;

type Modification = (typeof mods)[number];

const properties = defineProps<{
  mod: Modification;
}>();
const FallbackComponent = defineComponent({
  name: 'FallbackModification',
  props: { mod: { type: String, required: true } },
  setup: (properties) => {
    return () =>
      h(
        'div',
        { class: 'flex items-center justify-center text-sm text-semibold' },
        properties.mod,
      );
  },
});

const getModificationBackgroundColor = () => {
  if (increaseDifficultyMods.includes(properties.mod)) {
    return 'increase-difficulty-background';
  } else if (maniaMods.includes(properties.mod)) {
    return 'mania-background';
  } else if (decreaseDifficultyMods.includes(properties.mod)) {
    return 'decrease-difficulty-background';
  } else if (standardMods.includes(properties.mod)) {
    return 'standard-background';
  } else {
    return 'misc-mod-background';
  }
};

const getModificationForegroundColor = () => {
  if (increaseDifficultyMods.includes(properties.mod)) {
    return 'increase-difficulty-foreground';
  } else if (maniaMods.includes(properties.mod)) {
    return 'mania-foreground';
  } else if (decreaseDifficultyMods.includes(properties.mod)) {
    return 'decrease-difficulty-foreground';
  } else if (standardMods.includes(properties.mod)) {
    return 'standard-foreground';
  } else {
    return 'misc-mod-foreground';
  }
};

const modificationComponent = () => {
  return defineAsyncComponent({
    errorComponent: FallbackComponent,
    loadingComponent: FallbackComponent,
    loader: () =>
      import(`#src/components/mods/${properties.mod}Modification.vue`),
  });
};
</script>

<style scoped>
.container {
  --mania-color: hsl(255, 100%, 70%);
  --increase-difficulty-color: hsl(360, 100%, 70%);
  --decrease-difficulty-color: hsl(90, 100%, 70%);
  --standard-color: hsl(200, 100%, 70%);
  --misc-mod-color: hsl(46, 100%, 54%);
}

.decrease-difficulty-background {
  color: var(--decrease-difficulty-color);
}

.decrease-difficulty-foreground {
  color: color-mix(in srgb-linear, #000, var(--decrease-difficulty-color) 10%);
}

.increase-difficulty-background {
  color: var(--increase-difficulty-color);
}

.increase-difficulty-foreground {
  color: color-mix(in srgb-linear, #000, var(--increase-difficulty-color) 10%);
}

.mania-background {
  color: var(--mania-color);
}

.mania-foreground {
  color: color-mix(in srgb-linear, #000, var(--mania-color) 10%);
}

.misc-mod-background {
  color: var(--misc-mod-color);
}

.misc-mod-foreground {
  color: color-mix(in srgb-linear, #000, var(--misc-mod-color) 10%);
}

.standard-background {
  color: var(--standard-color);
}

.standard-foreground {
  color: color-mix(in srgb-linear, #000, var(--standard-color) 10%);
}
</style>
