<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">
        {{ $t('pages.designSystem.tabs.component.words.badge') }}
      </BaseHeadline>
      <div class="flex flex-row items-center space-x-2">
        <BaseBadge class="w-32" variant="base">
          {{ $t('pages.designSystem.words.base') }}
        </BaseBadge>
        <BaseBadge class="w-32" variant="small">
          {{ $t('pages.designSystem.words.small') }}
        </BaseBadge>
        <BaseBadge
          :icon="{ side: 'left', name: 'cubeTransparent' }"
          class="w-32"
        >
          {{ $t('pages.designSystem.words.icon') }}
        </BaseBadge>
        <BaseBadge
          :icon="{ side: 'right', name: 'cubeTransparent' }"
          class="w-32"
        >
          {{ $t('pages.designSystem.words.icon') }}
        </BaseBadge>
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseBadge class="w-32" color="primary">
          {{ $t('pages.designSystem.words.primary') }}
        </BaseBadge>
        <BaseBadge class="w-32" color="secondary">
          {{ $t('pages.designSystem.words.secondary') }}
        </BaseBadge>
        <BaseBadge class="w-32" color="green">
          {{ $t('pages.designSystem.tabs.component.words.green') }}
        </BaseBadge>
        <BaseBadge class="w-32" color="red">
          {{ $t('pages.designSystem.tabs.component.words.red') }}
        </BaseBadge>
        <BaseBadge class="w-32" color="yellow">
          {{ $t('pages.designSystem.tabs.component.words.yellow') }}
        </BaseBadge>
      </div>
    </div>
    <div class="space-y-2">
      <BaseHeadline variant="title">
        {{ $t('pages.designSystem.tabs.component.words.modification') }}
      </BaseHeadline>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification
          v-for="mod in increaseDifficultyMods"
          :key="mod"
          :mod
        />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification
          v-for="mod in decreaseDifficultyMods"
          :key="mod"
          :mod
        />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification v-for="mod in maniaMods" :key="mod" :mod />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification v-for="mod in standardMods" :key="mod" :mod />
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseModification v-for="mod in baseMods" :key="mod" :mod />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OsuBeatmapModification } from '@packages/shared';

import BaseBadge from '#src/components/base/baseBadge.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import BaseModification from '#src/components/base/baseModification.vue';

const baseMods = [OsuBeatmapModification.NoModification];
const decreaseDifficultyMods = [
  OsuBeatmapModification.Easy,
  OsuBeatmapModification.HalfTime,
  OsuBeatmapModification.NoFail,
];
const increaseDifficultyMods = [
  OsuBeatmapModification.DoubleTime,
  OsuBeatmapModification.FadeIn,
  OsuBeatmapModification.Flashlight,
  OsuBeatmapModification.HardRock,
  OsuBeatmapModification.Hidden,
  OsuBeatmapModification.Nightcore,
  OsuBeatmapModification.Perfect,
  OsuBeatmapModification.SuddenDeath,
];
const maniaMods = [
  OsuBeatmapModification.OneKey,
  OsuBeatmapModification.TwoKeys,
  OsuBeatmapModification.ThreeKeys,
  OsuBeatmapModification.FourKeys,
  OsuBeatmapModification.FiveKeys,
  OsuBeatmapModification.SixKeys,
  OsuBeatmapModification.SevenKeys,
  OsuBeatmapModification.EightKeys,
  OsuBeatmapModification.NineKeys,
  OsuBeatmapModification.Mirror,
];
const standardMods = [
  OsuBeatmapModification.AutoPilot,
  OsuBeatmapModification.Relax,
  OsuBeatmapModification.SpunOut,
];
</script>
