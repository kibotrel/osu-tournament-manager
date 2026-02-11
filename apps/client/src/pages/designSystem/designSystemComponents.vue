<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <BaseHeadline variant="title">
        {{ $t('pages.designSystem.tabs.component.words.badge') }}
      </BaseHeadline>
      <div class="flex flex-row items-center space-x-2">
        <BaseBadge
          v-for="badge in badgeVariants"
          :key="badge.translationKey"
          class="w-32"
          :variant="badge.variant"
          :icon="badge.icon"
        >
          {{ $t(badge.translationKey) }}
        </BaseBadge>
      </div>
      <div class="flex flex-row items-center space-x-2">
        <BaseBadge
          v-for="badge in badgeColors"
          :key="badge.color"
          class="w-32"
          :color="badge.color"
        >
          {{ $t(badge.translationKey) }}
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
    <div class="space-y-2">
      <BaseHeadline variant="title">
        {{ $t('pages.designSystem.tabs.component.words.countryFlag') }}
      </BaseHeadline>
      <div class="grid w-2xl grid-cols-18 gap-2">
        <BaseCountryFlag
          v-for="(countryFlag, index) in countryFlags"
          :key="`${countryFlag}-${index}`"
          class="h-8 w-8"
          :country-code="countryFlag"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OsuBeatmapModification } from '@packages/shared';

import type {
  BadgeColor,
  BadgeVariant,
} from '#src/components/base/baseBadge.vue';
import BaseBadge from '#src/components/base/baseBadge.vue';
import BaseCountryFlag from '#src/components/base/baseCountryFlag.vue';
import BaseHeadline from '#src/components/base/baseHeadline.vue';
import type { IconName } from '#src/components/base/baseIcon.vue';
import BaseModification from '#src/components/base/baseModification.vue';

interface Badge {
  icon: { side: 'left' | 'right'; name: IconName } | null;
  translationKey: string;
  variant: BadgeVariant;
  color: BadgeColor;
}

const badgeVariants: Badge[] = [
  {
    color: 'none',
    icon: null,
    translationKey: 'pages.designSystem.tabs.component.words.badge',
    variant: 'base',
  },
  {
    color: 'none',
    icon: null,
    translationKey: 'pages.designSystem.tabs.component.words.badge',
    variant: 'small',
  },
  {
    color: 'none',
    icon: { side: 'left', name: 'cubeTransparent' },
    translationKey: 'pages.designSystem.words.icon',
    variant: 'base',
  },
  {
    color: 'none',
    icon: { side: 'right', name: 'cubeTransparent' },
    translationKey: 'pages.designSystem.words.icon',
    variant: 'base',
  },
];
const badgeColors: Badge[] = [
  {
    icon: null,
    translationKey: 'pages.designSystem.words.primary',
    variant: 'base',
    color: 'primary',
  },
  {
    icon: null,
    translationKey: 'pages.designSystem.words.secondary',
    variant: 'base',
    color: 'secondary',
  },
  {
    icon: null,
    translationKey: 'pages.designSystem.tabs.component.words.green',
    variant: 'base',
    color: 'green',
  },
  {
    icon: null,
    translationKey: 'pages.designSystem.tabs.component.words.yellow',
    variant: 'base',
    color: 'yellow',
  },
  {
    icon: null,
    translationKey: 'pages.designSystem.tabs.component.words.red',
    variant: 'base',
    color: 'red',
  },
];
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
const countryFlags = [
  'AC',
  'AD',
  'AE',
  'AF',
  'AG',
  'AI',
  'AL',
  'AM',
  'AO',
  'AQ',
  'AR',
  'AS',
  'AT',
  'AU',
  'AW',
  'AX',
  'AZ',
  'BA',
  'BB',
  'BD',
  'BE',
  'BF',
  'BG',
  'BH',
  'BI',
  'BJ',
  'BL',
  'BM',
  'BN',
  'BO',
  'BQ',
  'BR',
  'BS',
  'BT',
  'BV',
  'BW',
  'BY',
  'BZ',
  'CA',
  'CC',
  'CD',
  'CF',
  'CG',
  'CH',
  'CI',
  'CK',
  'CL',
  'CM',
  'CN',
  'CO',
  'CP',
  'CQ',
  'CR',
  'CU',
  'CV',
  'CW',
  'CX',
  'CY',
  'CZ',
  'DE',
  'DG',
  'DJ',
  'DK',
  'DM',
  'DO',
  'DZ',
  'EA',
  'EC',
  'EE',
  'EG',
  'EH',
  'ER',
  'ES',
  'ET',
  'EU',
  'FI',
  'FJ',
  'FK',
  'FM',
  'FO',
  'FR',
  'GA',
  'GB',
  'GD',
  'GE',
  'GF',
  'GG',
  'GH',
  'GI',
  'GL',
  'GM',
  'GN',
  'GP',
  'GQ',
  'GR',
  'GS',
  'GT',
  'GU',
  'GW',
  'GY',
  'HK',
  'HM',
  'HN',
  'HR',
  'HT',
  'HU',
  'IC',
  'ID',
  'IE',
  'IL',
  'IM',
  'IN',
  'IO',
  'IQ',
  'IR',
  'IS',
  'IT',
  'JE',
  'JM',
  'JO',
  'JP',
  'KE',
  'KG',
  'KH',
  'KI',
  'KM',
  'KN',
  'KP',
  'KR',
  'KW',
  'KY',
  'KZ',
  'LA',
  'LB',
  'LC',
  'LI',
  'LK',
  'LR',
  'LS',
  'LT',
  'LU',
  'LV',
  'LY',
  'MA',
  'MC',
  'MD',
  'ME',
  'MF',
  'MG',
  'MH',
  'MK',
  'ML',
  'MM',
  'MN',
  'MO',
  'MP',
  'MQ',
  'MR',
  'MS',
  'MT',
  'MU',
  'MV',
  'MW',
  'MX',
  'MY',
  'MZ',
  'NA',
  'NC',
  'NE',
  'NF',
  'NG',
  'NI',
  'NL',
  'NO',
  'NP',
  'NR',
  'NU',
  'NZ',
  'OM',
  'PA',
  'PE',
  'PF',
  'PG',
  'PH',
  'PK',
  'PL',
  'PM',
  'PN',
  'PR',
  'PS',
  'PT',
  'PW',
  'PY',
  'QA',
  'RE',
  'RO',
  'RS',
  'RU',
  'RW',
  'SA',
  'SB',
  'SC',
  'SD',
  'SE',
  'SG',
  'SH',
  'SI',
  'SJ',
  'SK',
  'SL',
  'SM',
  'SN',
  'SO',
  'SR',
  'SS',
  'ST',
  'SV',
  'SX',
  'SY',
  'SZ',
  'TA',
  'TC',
  'TD',
  'TF',
  'TG',
  'TH',
  'TJ',
  'TK',
  'TL',
  'TM',
  'TN',
  'TO',
  'TR',
  'TT',
  'TV',
  'TW',
  'TZ',
  'UA',
  'UG',
  'UM',
  'UN',
  'US',
  'UY',
  'UZ',
  'VA',
  'VC',
  'VE',
  'VG',
  'VI',
  'VN',
  'VU',
  'WF',
  'WS',
  'XK',
  'YE',
  'YT',
  'ZA',
  'ZM',
  'ZW',
];
</script>
