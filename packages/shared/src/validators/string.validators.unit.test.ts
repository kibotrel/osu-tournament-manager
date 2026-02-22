import { describe, expect, it } from 'vitest';

import { OsuBeatmapModification } from '#src/shared.export.js';

import {
  isOsuBeatmapModificationDifficultyDecrease,
  isOsuBeatmapModificationDifficultyIncrease,
  isOsuBeatmapModificationManiaSpecific,
  isOsuBeatmapModificationStandardSpecific,
} from './string.validators.js';

describe('isOsuBeatmapModificationDifficultyDecrease', () => {
  it('should return true for valid difficulty decrease modifications', () => {
    const validModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.Easy,
      OsuBeatmapModification.HalfTime,
      OsuBeatmapModification.NoFail,
    ];

    for (const modification of validModifications) {
      expect(
        isOsuBeatmapModificationDifficultyDecrease(modification),
        modification,
      ).toBe(true);
    }
  });

  it('should return false for any other modification', () => {
    const invalidModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.AutoPilot,
      OsuBeatmapModification.Coop,
      OsuBeatmapModification.DoubleTime,
      OsuBeatmapModification.EightKeys,
      OsuBeatmapModification.FadeIn,
      OsuBeatmapModification.FiveKeys,
      OsuBeatmapModification.Flashlight,
      OsuBeatmapModification.FourKeys,
      OsuBeatmapModification.FreeModification,
      OsuBeatmapModification.HardRock,
      OsuBeatmapModification.Hidden,
      OsuBeatmapModification.Mirror,
      OsuBeatmapModification.Nightcore,
      OsuBeatmapModification.NineKeys,
      OsuBeatmapModification.NoModification,
      OsuBeatmapModification.OneKey,
      OsuBeatmapModification.Perfect,
      OsuBeatmapModification.Relax,
      OsuBeatmapModification.SevenKeys,
      OsuBeatmapModification.SixKeys,
      OsuBeatmapModification.SpunOut,
      OsuBeatmapModification.SuddenDeath,
      OsuBeatmapModification.ThreeKeys,
      OsuBeatmapModification.TwoKeys,
    ];

    for (const modification of invalidModifications) {
      expect(
        isOsuBeatmapModificationDifficultyDecrease(modification),
        modification,
      ).toBe(false);
    }
  });
});

describe('isOsuBeatmapModificationDifficultyIncrease', () => {
  it('should return true for valid difficulty increase modifications', () => {
    const validModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.DoubleTime,
      OsuBeatmapModification.FadeIn,
      OsuBeatmapModification.Flashlight,
      OsuBeatmapModification.HardRock,
      OsuBeatmapModification.Hidden,
      OsuBeatmapModification.Nightcore,
      OsuBeatmapModification.Perfect,
      OsuBeatmapModification.SuddenDeath,
    ];

    for (const modification of validModifications) {
      expect(
        isOsuBeatmapModificationDifficultyIncrease(modification),
        modification,
      ).toBe(true);
    }
  });

  it('should return false for any other modification', () => {
    const invalidModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.AutoPilot,
      OsuBeatmapModification.Coop,
      OsuBeatmapModification.Easy,
      OsuBeatmapModification.EightKeys,
      OsuBeatmapModification.FiveKeys,
      OsuBeatmapModification.FourKeys,
      OsuBeatmapModification.FreeModification,
      OsuBeatmapModification.HalfTime,
      OsuBeatmapModification.Mirror,
      OsuBeatmapModification.NineKeys,
      OsuBeatmapModification.NoFail,
      OsuBeatmapModification.NoModification,
      OsuBeatmapModification.OneKey,
      OsuBeatmapModification.Relax,
      OsuBeatmapModification.SevenKeys,
      OsuBeatmapModification.SixKeys,
      OsuBeatmapModification.SpunOut,
      OsuBeatmapModification.ThreeKeys,
      OsuBeatmapModification.TwoKeys,
    ];

    for (const modification of invalidModifications) {
      expect(
        isOsuBeatmapModificationDifficultyIncrease(modification),
        modification,
      ).toBe(false);
    }
  });
});

describe('isOsuBeatmapModificationManiaSpecific', () => {
  it('should return true for valid mania specific modifications', () => {
    const validModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.Coop,
      OsuBeatmapModification.EightKeys,
      OsuBeatmapModification.FiveKeys,
      OsuBeatmapModification.FourKeys,
      OsuBeatmapModification.Mirror,
      OsuBeatmapModification.NineKeys,
      OsuBeatmapModification.OneKey,
      OsuBeatmapModification.SevenKeys,
      OsuBeatmapModification.SixKeys,
      OsuBeatmapModification.ThreeKeys,
      OsuBeatmapModification.TwoKeys,
    ];

    for (const modification of validModifications) {
      expect(
        isOsuBeatmapModificationManiaSpecific(modification),
        modification,
      ).toBe(true);
    }
  });

  it('should return false for any other modification', () => {
    const invalidModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.AutoPilot,
      OsuBeatmapModification.DoubleTime,
      OsuBeatmapModification.Easy,
      OsuBeatmapModification.FadeIn,
      OsuBeatmapModification.Flashlight,
      OsuBeatmapModification.FreeModification,
      OsuBeatmapModification.HalfTime,
      OsuBeatmapModification.HardRock,
      OsuBeatmapModification.Hidden,
      OsuBeatmapModification.Nightcore,
      OsuBeatmapModification.NoFail,
      OsuBeatmapModification.NoModification,
      OsuBeatmapModification.Perfect,
      OsuBeatmapModification.Relax,
      OsuBeatmapModification.SpunOut,
      OsuBeatmapModification.SuddenDeath,
    ];

    for (const modification of invalidModifications) {
      expect(
        isOsuBeatmapModificationManiaSpecific(modification),
        modification,
      ).toBe(false);
    }
  });
});

describe('isOsuBeatmapModificationStandardSpecific', () => {
  it('should return true for valid standard specific modifications', () => {
    const validModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.AutoPilot,
      OsuBeatmapModification.Relax,
      OsuBeatmapModification.SpunOut,
    ];

    for (const modification of validModifications) {
      expect(
        isOsuBeatmapModificationStandardSpecific(modification),
        modification,
      ).toBe(true);
    }
  });

  it('should return false for any other modification', () => {
    const invalidModifications: OsuBeatmapModification[] = [
      OsuBeatmapModification.Coop,
      OsuBeatmapModification.DoubleTime,
      OsuBeatmapModification.Easy,
      OsuBeatmapModification.EightKeys,
      OsuBeatmapModification.FadeIn,
      OsuBeatmapModification.FiveKeys,
      OsuBeatmapModification.Flashlight,
      OsuBeatmapModification.FourKeys,
      OsuBeatmapModification.FreeModification,
      OsuBeatmapModification.HalfTime,
      OsuBeatmapModification.HardRock,
      OsuBeatmapModification.Hidden,
      OsuBeatmapModification.Mirror,
      OsuBeatmapModification.Nightcore,
      OsuBeatmapModification.NineKeys,
      OsuBeatmapModification.NoFail,
      OsuBeatmapModification.NoModification,
      OsuBeatmapModification.OneKey,
      OsuBeatmapModification.Perfect,
      OsuBeatmapModification.SevenKeys,
      OsuBeatmapModification.SixKeys,
      OsuBeatmapModification.SuddenDeath,
      OsuBeatmapModification.ThreeKeys,
      OsuBeatmapModification.TwoKeys,
    ];

    for (const modification of invalidModifications) {
      expect(
        isOsuBeatmapModificationStandardSpecific(modification),
        modification,
      ).toBe(false);
    }
  });
});
