import { OsuBeatmapModification } from '#src/constants/osuConstants.js';

export const isOsuBeatmapModificationDifficultyDecrease = (
  modification: OsuBeatmapModification,
): boolean => {
  const validModifications: Set<OsuBeatmapModification> = new Set([
    OsuBeatmapModification.Easy,
    OsuBeatmapModification.HalfTime,
    OsuBeatmapModification.NoFail,
  ]);

  return validModifications.has(modification);
};

export const isOsuBeatmapModificationDifficultyIncrease = (
  modification: OsuBeatmapModification,
): boolean => {
  const validModifications: Set<OsuBeatmapModification> = new Set([
    OsuBeatmapModification.DoubleTime,
    OsuBeatmapModification.FadeIn,
    OsuBeatmapModification.Flashlight,
    OsuBeatmapModification.HardRock,
    OsuBeatmapModification.Hidden,
    OsuBeatmapModification.Nightcore,
    OsuBeatmapModification.Perfect,
    OsuBeatmapModification.SuddenDeath,
  ]);

  return validModifications.has(modification);
};

export const isOsuBeatmapModificationManiaSpecific = (
  modification: OsuBeatmapModification,
): boolean => {
  const validModifications: Set<OsuBeatmapModification> = new Set([
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
  ]);

  return validModifications.has(modification);
};

export const isOsuBeatmapModificationStandardSpecific = (
  modification: OsuBeatmapModification,
): boolean => {
  const validModifications: Set<OsuBeatmapModification> = new Set([
    OsuBeatmapModification.AutoPilot,
    OsuBeatmapModification.Relax,
    OsuBeatmapModification.SpunOut,
  ]);

  return validModifications.has(modification);
};
