<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">Badges</BaseHeadline>
      <div class="flex flex-row items-center space-x-2">
        <BaseBadge variant="base"> Base </BaseBadge>
        <BaseBadge variant="small"> Small </BaseBadge>
        <BaseBadge :icon="{ side: 'left', name: 'cubeTransparent' }">
          Left icon
        </BaseBadge>
        <BaseBadge :icon="{ side: 'right', name: 'cubeTransparent' }">
          Right icon
        </BaseBadge>
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseBadge color="primary">Primary</BaseBadge>
        <BaseBadge color="secondary">Secondary</BaseBadge>
        <BaseBadge color="green">Green</BaseBadge>
        <BaseBadge color="red">Red</BaseBadge>
        <BaseBadge color="yellow">Yellow</BaseBadge>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">Mods</BaseHeadline>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification
          v-for="mod in increaseDifficultyMods"
          :key="mod"
          :mod="mod"
        />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification
          v-for="mod in decreaseDifficultyMods"
          :key="mod"
          :mod="mod"
        />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification v-for="mod in maniaMods" :key="mod" :mod="mod" />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification v-for="mod in standardMods" :key="mod" :mod="mod" />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification v-for="mod in baseMods" :key="mod" :mod="mod" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseBadge from '#src/components/base/baseBadge.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseModification from '#src/components/base/baseModification.vue';

const baseMods = ['NM'];
const increaseDifficultyMods = ['DT', 'FI', 'FL', 'HD', 'HR', 'NC', 'PF', 'SD'];
const maniaMods = ['4K', '5K', '6K', '7K', '8K', '9K', 'MR'];
const decreaseDifficultyMods = ['EZ', 'HT', 'NF'];
const standardMods = ['RX', 'SO'];
</script>
