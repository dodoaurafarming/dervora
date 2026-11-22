import { ALL_QUESTIONS, type SkinDimension } from '../data/quizData';

export type SkinType = 'Dry' | 'Normal' | 'Combination' | 'Oily';
export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe';
export type BarrierStatus = 'healthy' | 'mildly-compromised' | 'compromised';
export type ZonePattern = 'none' | 'tzone' | 'full';
export type AcneSubType = 'none' | 'comedonal' | 'inflammatory' | 'mixed';

export interface DimensionScores {
  dry: number;
  oily: number;
  dehydrated: number;
  acne: number;
  sensitive: number;
  pigmentation: number;
}

export interface SkinSeverities {
  acne: SeverityLevel;
  sensitive: SeverityLevel;
  dehydrated: SeverityLevel;
  pigmentation: SeverityLevel;
}

export interface SafetyFlags {
  avoidHarshActives: boolean;
  avoidComedogenic: boolean;
  prioritizeBarrierRepair: boolean;
}

export interface SkinProfile {
  skinType: SkinType;
  skinTypeScore: number;
  isAcneProne: boolean;
  acneScore: number;
  isSensitive: boolean;
  sensitiveScore: number;
  isDehydrated: boolean;
  dehydratedScore: number;
  hasDarkSpots: boolean;
  concerns: string[];
  rawScores: DimensionScores;
  indices: DimensionScores;
  severities: SkinSeverities;
  barrierStatus: BarrierStatus;
  zonePattern: ZonePattern;
  acneSubType: AcneSubType;
  explicitConcerns: string[];
  inferredConcerns: string[];
  concernWeights: Record<string, number>;
  safetyFlags: SafetyFlags;
}

const DIMENSIONS: SkinDimension[] = [
  'dry',
  'oily',
  'dehydrated',
  'acne',
  'sensitive',
  'pigmentation',
];

const Q8_SCORE_MAP: Record<string, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  'very-often': 4,
};

const Q9_SCORE_MAP: Record<string, number> = {
  none: 0,
  nose: 1,
  'nose-around': 2,
  tzone: 3,
  'tzone-cheek': 4,
};

const Q13_SCORE_MAP: Record<string, number> = {
  never: 0,
  rarely: 1,
  sometimes: 2,
  often: 3,
  'very-often': 4,
};

function createEmptyDimensionScores(): DimensionScores {
  return {
    dry: 0,
    oily: 0,
    dehydrated: 0,
    acne: 0,
    sensitive: 0,
    pigmentation: 0,
  };
}

function computeMaxDimensionScores(): DimensionScores {
  const maxScores = createEmptyDimensionScores();

  for (const question of ALL_QUESTIONS) {
    if (question.type !== 'single') continue;

    for (const dimension of DIMENSIONS) {
      let questionMax = 0;
      for (const option of question.options) {
        const value = option.score?.[dimension] ?? 0;
        if (value > questionMax) {
          questionMax = value;
        }
      }
      maxScores[dimension] += questionMax;
    }
  }

  return maxScores;
}

function normalizeScore(raw: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((raw / max) * 100)));
}

function roundTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function classifySeverity(index: number): SeverityLevel {
  if (index < 15) return 'none';
  if (index < 35) return 'mild';
  if (index < 65) return 'moderate';
  return 'severe';
}

function resolveZonePattern(
  tzoneVotes: number,
  fullVotes: number,
  oilyIndex: number
): ZonePattern {
  if (fullVotes >= 2) return 'full';
  if (
    tzoneVotes >= 2 ||
    (tzoneVotes >= 1 && fullVotes === 0 && oilyIndex >= 20) ||
    (fullVotes === 1 && tzoneVotes >= 1)
  ) {
    return 'tzone';
  }
  return 'none';
}

function classifySkinType(
  oilyIndex: number,
  dryIndex: number,
  zonePattern: ZonePattern,
  fullVotes: number
): SkinType {
  const netScore = oilyIndex - dryIndex;

  if (oilyIndex < 25 && dryIndex < 25) {
    return 'Normal';
  }

  if (oilyIndex >= 25 && dryIndex >= 25) {
    if (fullVotes >= 2 && netScore >= 25) return 'Oily';
    if (netScore <= -35 && zonePattern === 'none') return 'Dry';
    return 'Combination';
  }

  if (oilyIndex >= 25) {
    if (zonePattern === 'tzone' && fullVotes === 0 && oilyIndex < 65) {
      return 'Combination';
    }
    return 'Oily';
  }

  return 'Dry';
}

function resolveBarrierStatus(
  dehydratedIndex: number,
  sensitiveIndex: number,
  q14Answer: string | undefined
): BarrierStatus {
  const hasFrequentStinging =
    q14Answer === 'often' || q14Answer === 'almost-always';

  if (
    (dehydratedIndex >= 50 && sensitiveIndex >= 45) ||
    dehydratedIndex >= 65 ||
    (hasFrequentStinging && dehydratedIndex >= 35)
  ) {
    return 'compromised';
  }

  if (dehydratedIndex >= 30 || (sensitiveIndex >= 40 && hasFrequentStinging)) {
    return 'mildly-compromised';
  }

  return 'healthy';
}

function buildConcernProfile(
  indices: DimensionScores,
  answers: Record<string, string | string[]>
): {
  explicitConcerns: string[];
  inferredConcerns: string[];
  concernWeights: Record<string, number>;
  concerns: string[];
} {
  const q8Score = Q8_SCORE_MAP[String(answers.q8 ?? '')] ?? 0;
  const q9Score = Q9_SCORE_MAP[String(answers.q9 ?? '')] ?? 0;
  const q13Score = Q13_SCORE_MAP[String(answers.q13 ?? '')] ?? 0;

  const comedonalSignal = (q8Score + q9Score) / 8;
  const rednessSignal = Math.max(
    q13Score / 4,
    (indices.sensitive / 100) * 0.85
  );
  const pigmentationSignal = indices.pigmentation / 100;

  const clinicalSignals: Record<string, number> = {
    acne: indices.acne / 100,
    blackheads: comedonalSignal,
    'excess-oil': indices.oily / 100,
    dehydration: Math.max(indices.dehydrated, indices.dry) / 100,
    'dark-spots': pigmentationSignal,
    redness: rednessSignal,
  };

  const rawSelected = Array.isArray(answers.q20) ? answers.q20 : [];
  const explicitConcerns = Array.from(
    new Set(rawSelected.filter((item) => item && item !== 'other'))
  );

  const concernWeights: Record<string, number> = {};

  for (const concern of explicitConcerns) {
    if (concern in clinicalSignals) {
      concernWeights[concern] = roundTwoDecimals(
        clamp(0.45 + 0.55 * clinicalSignals[concern], 0.5, 1)
      );
    } else if (concern === 'uneven-tone') {
      concernWeights[concern] = roundTwoDecimals(
        clamp(0.45 + 0.55 * pigmentationSignal, 0.5, 1)
      );
    } else {
      concernWeights[concern] = 0.8;
    }
  }

  const inferredCandidates: Array<{ concern: string; weight: number }> = [];

  for (const [concern, signal] of Object.entries(clinicalSignals)) {
    if (concern in concernWeights) continue;
    if (concern === 'dark-spots' && 'uneven-tone' in concernWeights) continue;
    if (signal >= 0.5) {
      inferredCandidates.push({
        concern,
        weight: roundTwoDecimals(signal * 0.65),
      });
    }
  }

  inferredCandidates.sort((a, b) => b.weight - a.weight);
  const topInferred = inferredCandidates.slice(0, 3);
  const inferredConcerns: string[] = [];

  for (const item of topInferred) {
    concernWeights[item.concern] = item.weight;
    inferredConcerns.push(item.concern);
  }

  const concerns = Object.keys(concernWeights).sort(
    (a, b) => concernWeights[b] - concernWeights[a]
  );

  return {
    explicitConcerns,
    inferredConcerns,
    concernWeights,
    concerns,
  };
}

function buildSafetyFlags(
  skinType: SkinType,
  severities: SkinSeverities,
  barrierStatus: BarrierStatus
): SafetyFlags {
  const avoidHarshActives =
    barrierStatus === 'compromised' ||
    severities.sensitive === 'severe' ||
    (severities.sensitive === 'moderate' &&
      barrierStatus === 'mildly-compromised');

  const avoidComedogenic =
    severities.acne === 'moderate' ||
    severities.acne === 'severe' ||
    (skinType === 'Oily' && severities.acne === 'mild');

  const prioritizeBarrierRepair =
    barrierStatus !== 'healthy' ||
    severities.dehydrated === 'moderate' ||
    severities.dehydrated === 'severe';

  return {
    avoidHarshActives,
    avoidComedogenic,
    prioritizeBarrierRepair,
  };
}

export function calculateSkinProfile(
  answers: Record<string, string | string[]>
): SkinProfile {
  const rawScores = createEmptyDimensionScores();
  const maxScores = computeMaxDimensionScores();

  let tzoneVotes = 0;
  let fullVotes = 0;
  let acneSubType: AcneSubType = 'none';

  for (const question of ALL_QUESTIONS) {
    if (question.type !== 'single') continue;

    const answer = answers[question.id];
    if (typeof answer !== 'string' || !answer) continue;

    const selectedOption = question.options.find((opt) => opt.value === answer);
    if (!selectedOption) continue;

    if (selectedOption.score) {
      for (const dimension of DIMENSIONS) {
        rawScores[dimension] += selectedOption.score[dimension] ?? 0;
      }
    }

    if (selectedOption.zonePattern === 'tzone') {
      tzoneVotes += 1;
    } else if (selectedOption.zonePattern === 'full') {
      fullVotes += 1;
    }

    if (question.id === 'q12' && selectedOption.acneSubType) {
      acneSubType = selectedOption.acneSubType;
    }
  }

  const indices: DimensionScores = {
    dry: normalizeScore(rawScores.dry, maxScores.dry),
    oily: normalizeScore(rawScores.oily, maxScores.oily),
    dehydrated: normalizeScore(rawScores.dehydrated, maxScores.dehydrated),
    acne: normalizeScore(rawScores.acne, maxScores.acne),
    sensitive: normalizeScore(rawScores.sensitive, maxScores.sensitive),
    pigmentation: normalizeScore(rawScores.pigmentation, maxScores.pigmentation),
  };

  const zonePattern = resolveZonePattern(tzoneVotes, fullVotes, indices.oily);
  const skinType = classifySkinType(
    indices.oily,
    indices.dry,
    zonePattern,
    fullVotes
  );
  const skinTypeScore = indices.oily - indices.dry;

  const severities: SkinSeverities = {
    acne: classifySeverity(indices.acne),
    sensitive: classifySeverity(indices.sensitive),
    dehydrated: classifySeverity(indices.dehydrated),
    pigmentation: classifySeverity(indices.pigmentation),
  };

  const q14Answer =
    typeof answers.q14 === 'string' ? answers.q14 : undefined;
  const barrierStatus = resolveBarrierStatus(
    indices.dehydrated,
    indices.sensitive,
    q14Answer
  );

  const {
    explicitConcerns,
    inferredConcerns,
    concernWeights,
    concerns,
  } = buildConcernProfile(indices, answers);

  const safetyFlags = buildSafetyFlags(skinType, severities, barrierStatus);

  const isAcneProne =
    severities.acne === 'moderate' || severities.acne === 'severe';
  const isSensitive =
    severities.sensitive === 'moderate' || severities.sensitive === 'severe';
  const isDehydrated =
    severities.dehydrated === 'moderate' || severities.dehydrated === 'severe';
  const hasDarkSpots = indices.pigmentation >= 25;

  return {
    skinType,
    skinTypeScore,
    isAcneProne,
    acneScore: rawScores.acne,
    isSensitive,
    sensitiveScore: rawScores.sensitive,
    isDehydrated,
    dehydratedScore: rawScores.dehydrated,
    hasDarkSpots,
    concerns,
    rawScores,
    indices,
    severities,
    barrierStatus,
    zonePattern,
    acneSubType,
    explicitConcerns,
    inferredConcerns,
    concernWeights,
    safetyFlags,
  };
}

export const CONCERN_LABELS: Record<string, string> = {
  acne: 'Jerawat',
  blackheads: 'Komedo/Pori Tersumbat',
  'excess-oil': 'Minyak Berlebih',
  dehydration: 'Kulit Kering/Dehidrasi',
  dullness: 'Kulit Kusam',
  'dark-spots': 'Bekas Jerawat/Dark Spots',
  'uneven-tone': 'Warna Kulit Tidak Merata',
  redness: 'Kemerahan',
  'uneven-texture': 'Tekstur Kulit Tidak Rata',
  'fine-lines': 'Garis Halus/Kerutan',
  other: 'Lainnya',
};

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  Dry: 'Kulit Kering',
  Normal: 'Kulit Normal',
  Combination: 'Kulit Kombinasi',
  Oily: 'Kulit Berminyak',
};

export const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  none: 'Minimal',
  mild: 'Ringan',
  moderate: 'Sedang',
  severe: 'Tinggi',
};

export const BARRIER_STATUS_LABELS: Record<BarrierStatus, string> = {
  healthy: 'Sehat',
  'mildly-compromised': 'Mulai Sensitif/Terganggu',
  compromised: 'Butuh Pemulihan Barrier',
};