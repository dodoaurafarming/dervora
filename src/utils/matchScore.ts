import type { Product } from '../lib/api';
import type { SkinProfile, SkinType } from './quizScoring';
import { CONCERN_LABELS, SKIN_TYPE_LABELS } from './quizScoring';

export type MatchTier = 'excellent' | 'good' | 'moderate' | 'low';

export interface MatchResult {
  score: number;
  reasons: string[];
  breakdown: {
    skinTypes: number;
    concerns: number;
    ingredients: number;
    quality: number;
    safetyPenalty: number;
  };
  matchTier: MatchTier;
  warnings: string[];
  matchedConcerns: string[];
  beneficialIngredients: string[];
  riskyIngredients: string[];
}

export interface RankedProduct {
  product: Product;
  match: MatchResult;
}

interface IngredientMetadata {
  name: string;
  suitableSkin?: unknown;
  concerns?: unknown;
}

type IngredientRole =
  | 'barrier_hydration'
  | 'soothing'
  | 'acne_comedonal'
  | 'acne_inflammatory'
  | 'oil_control'
  | 'brightening'
  | 'anti_aging_texture';

interface RiskRule {
  key: string;
  label: string;
  penalty: number;
  moderatePenalty?: number;
  test: (normalizedName: string) => boolean;
}

const CONCERN_SYNONYMS: Record<string, string[]> = {
  acne: [
    'acne',
    'jerawat',
    'pimple',
    'breakout',
    'blemish',
    'anti-acne',
    'acne-prone',
    'bruntusan',
  ],
  blackheads: [
    'blackhead',
    'whitehead',
    'komedo',
    'pore',
    'pori',
    'clogged',
    'sebum',
  ],
  'excess-oil': [
    'oily',
    'oil control',
    'excess oil',
    'minyak',
    'sebum',
    'shine',
    'matte',
  ],
  dehydration: [
    'dehydrat',
    'dehidrasi',
    'dry',
    'kering',
    'hydrat',
    'hidrasi',
    'moistur',
    'barrier',
    'lembab',
    'lembap',
    'flaky',
    'mengelupas',
  ],
  dullness: [
    'dull',
    'kusam',
    'brighten',
    'cerah',
    'glow',
    'radiance',
    'mencerahkan',
  ],
  'dark-spots': [
    'dark spot',
    'hyperpigmentation',
    'hiperpigmentasi',
    'pih',
    'pie',
    'bekas jerawat',
    'flek',
    'noda hitam',
    'melasma',
    'spot',
  ],
  'uneven-tone': [
    'uneven tone',
    'warna kulit',
    'brighten',
    'tone',
    'belang',
    'kusam',
    'hyperpigmentation',
  ],
  redness: [
    'redness',
    'kemerahan',
    'sooth',
    'calm',
    'menenangkan',
    'iritasi',
    'irritat',
    'sensitif',
    'sensitive',
    'inflamm',
    'radang',
  ],
  'uneven-texture': [
    'texture',
    'tekstur',
    'exfoliat',
    'eksfoliasi',
    'smooth',
    'halus',
    'kasar',
    'rough',
    'bumpy',
    'bruntusan',
  ],
  'fine-lines': [
    'fine line',
    'wrinkle',
    'kerutan',
    'garis halus',
    'aging',
    'anti-aging',
    'firm',
    'elastis',
    'elasticity',
    'kendur',
  ],
};

const FATTY_ALCOHOLS = [
  'cetyl alcohol',
  'cetearyl alcohol',
  'stearyl alcohol',
  'behenyl alcohol',
  'myristyl alcohol',
  'lauryl alcohol',
  'arachidyl alcohol',
  'oleyl alcohol',
];

const NON_HYDRATING_UREA_PRESERVATIVES = [
  'imidazolidinyl urea',
  'diazolidinyl urea',
];

const INGREDIENT_ROLE_MATCHERS: Record<
  IngredientRole,
  Array<(name: string) => boolean>
> = {
  barrier_hydration: [
    (n) => hasAnySubstring(n, [
      'ceramide',
      'panthenol',
      'hyaluronic',
      'hyaluronate',
      'glycerin',
      'squalane',
      'beta-glucan',
      'cholesterol',
      'madecassoside',
      'allantoin',
      'ectoin',
      'shea butter',
      'butyrospermum parkii',
      'snail',
      'trehalose',
      'polyglutamic',
      'amino acid',
      'phytosphingosine',
    ]),
    (n) =>
      /\burea\b/.test(n) &&
      !hasAnySubstring(n, NON_HYDRATING_UREA_PRESERVATIVES),
  ],
  soothing: [
    (n) => hasAnySubstring(n, [
      'centella',
      'cica',
      'madecassoside',
      'asiaticoside',
      'mugwort',
      'artemisia',
      'chamomile',
      'bisabolol',
      'allantoin',
      'avena sativa',
      'calendula',
      'green tea',
      'camellia sinensis',
      'heartleaf',
      'houttuynia',
      'panthenol',
      'aloe',
      'azulene',
    ]),
    (n) => /\boat\b/.test(n),
  ],
  acne_comedonal: [
    (n) => hasAnySubstring(n, [
      'salicylic',
      'capryloyl salicylic',
      'gluconolactone',
      'niacinamide',
      'zinc pca',
      'retinol',
      'adapalene',
      'kaolin',
      'bentonite',
      'charcoal',
    ]),
    (n) => /\b(bha|lha|pha)\b/.test(n),
  ],
  acne_inflammatory: [
    (n) => hasAnySubstring(n, [
      'benzoyl peroxide',
      'sulfur',
      'tea tree',
      'melaleuca',
      'azelaic',
      'salicylic',
      'centella',
      'niacinamide',
      'zinc pca',
      'succinic',
      'piroctone olamine',
      'propolis',
    ]),
  ],
  oil_control: [
    (n) => hasAnySubstring(n, [
      'niacinamide',
      'zinc pca',
      'salicylic',
      'green tea',
      'camellia sinensis',
      'witch hazel',
      'hamamelis',
      'kaolin',
      'silica',
      'sarcosine',
    ]),
    (n) => /\bzinc\b/.test(n),
  ],
  brightening: [
    (n) => hasAnySubstring(n, [
      'niacinamide',
      'vitamin c',
      'ascorbic',
      'ascorbyl',
      'arbutin',
      'tranexamic',
      'kojic',
      'azelaic',
      'licorice',
      'glycyrrhiza',
      'glutathione',
      'symwhite',
      'phenylethyl resorcinol',
      'glycolic',
      'lactic',
      'mandelic',
      'cysteamine',
    ]),
  ],
  anti_aging_texture: [
    (n) => hasAnySubstring(n, [
      'retinol',
      'retinal',
      'bakuchiol',
      'peptide',
      'matrixyl',
      'argireline',
      'adenosine',
      'collagen',
      'glycolic',
      'lactic',
      'mandelic',
      'gluconolactone',
      'vitamin c',
      'ascorbic',
      'ubiquinone',
      'coenzyme q10',
      'resveratrol',
    ]),
  ],
};

const HARSH_IRRITANT_RULES: RiskRule[] = [
  {
    key: 'fragrance',
    label: 'Fragrance/Parfum',
    penalty: 8,
    moderatePenalty: 5,
    test: (n) => hasAnySubstring(n, ['fragrance', 'parfum', 'perfume']),
  },
  {
    key: 'drying_alcohol',
    label: 'Alkohol pengering',
    penalty: 10,
    moderatePenalty: 6,
    test: isDryingAlcohol,
  },
  {
    key: 'essential_oil',
    label: 'Essential oil / alergen aromatik',
    penalty: 7,
    moderatePenalty: 4,
    test: (n) =>
      hasAnySubstring(n, [
        'menthol',
        'peppermint',
        'eucalyptus',
        'citrus limon',
        'lemon oil',
        'orange peel oil',
        'limonene',
        'linalool',
        'geraniol',
        'citronellol',
      ]),
  },
  {
    key: 'harsh_surfactant',
    label: 'Surfaktan keras (SLS)',
    penalty: 10,
    moderatePenalty: 6,
    test: (n) =>
      hasAnySubstring(n, ['sodium lauryl sulfate', 'ammonium lauryl sulfate']) ||
      /\bsls\b/.test(n),
  },
];

const STRONG_ACTIVE_RULES: RiskRule[] = [
  {
    key: 'strong_acid',
    label: 'Eksfolian asam kuat (AHA/BHA)',
    penalty: 10,
    test: (n) =>
      hasAnySubstring(n, [
        'glycolic acid',
        'salicylic acid',
        'lactic acid',
        'trichloroacetic',
      ]) || /\b(aha|bha)\b/.test(n),
  },
  {
    key: 'retinoid',
    label: 'Retinoid kuat',
    penalty: 10,
    test: (n) =>
      hasAnySubstring(n, ['retinol', 'retinal', 'tretinoin', 'adapalene']),
  },
  {
    key: 'benzoyl',
    label: 'Benzoyl Peroxide',
    penalty: 9,
    test: (n) => n.includes('benzoyl peroxide'),
  },
];

const COMEDOGENIC_RULES: RiskRule[] = [
  {
    key: 'coconut_oil',
    label: 'Coconut Oil (berpotensi menyumbat pori)',
    penalty: 8,
    test: (n) => hasAnySubstring(n, ['cocos nucifera', 'coconut oil']),
  },
  {
    key: 'cocoa_butter',
    label: 'Cocoa Butter',
    penalty: 7,
    test: (n) => hasAnySubstring(n, ['theobroma cacao', 'cocoa butter']),
  },
  {
    key: 'isopropyl_esters',
    label: 'Ester komedogenik (Isopropyl Myristate/Palmitate)',
    penalty: 9,
    test: (n) =>
      hasAnySubstring(n, [
        'isopropyl myristate',
        'isopropyl palmitate',
        'myristyl myristate',
      ]),
  },
  {
    key: 'lanolin',
    label: 'Lanolin',
    penalty: 6,
    test: (n) => n.includes('lanolin'),
  },
  {
    key: 'wheat_germ',
    label: 'Wheat Germ Oil',
    penalty: 8,
    test: (n) => hasAnySubstring(n, ['triticum vulgare', 'wheat germ oil']),
  },
  {
    key: 'palm_oil',
    label: 'Palm Oil',
    penalty: 6,
    test: (n) => hasAnySubstring(n, ['elaeis guineensis', 'palm oil']),
  },
];

const DRYING_AGENT_RULES: RiskRule[] = [
  {
    key: 'drying_alcohol',
    label: 'Alkohol pengering',
    penalty: 6,
    test: isDryingAlcohol,
  },
  {
    key: 'clay',
    label: 'Clay/absorben minyak kuat',
    penalty: 5,
    test: (n) => hasAnySubstring(n, ['kaolin', 'bentonite', 'charcoal']),
  },
  {
    key: 'harsh_surfactant',
    label: 'Surfaktan keras (SLS)',
    penalty: 7,
    test: (n) =>
      hasAnySubstring(n, ['sodium lauryl sulfate', 'ammonium lauryl sulfate']) ||
      /\bsls\b/.test(n),
  },
];

const ALL_ROLES: IngredientRole[] = [
  'barrier_hydration',
  'soothing',
  'acne_comedonal',
  'acne_inflammatory',
  'oil_control',
  'brightening',
  'anti_aging_texture',
];

function hasAnySubstring(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

function isDryingAlcohol(normalizedName: string): boolean {
  if (hasAnySubstring(normalizedName, FATTY_ALCOHOLS)) {
    return false;
  }
  if (normalizedName.trim() === 'alcohol') {
    return true;
  }
  return hasAnySubstring(normalizedName, [
    'alcohol denat',
    'sd alcohol',
    'isopropyl alcohol',
    'ethanol',
  ]);
}

function isStrongActiveIngredient(normalizedName: string): boolean {
  return STRONG_ACTIVE_RULES.some((rule) => rule.test(normalizedName));
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function extractIngredients(product: Product): IngredientMetadata[] {
  const rawList = product.ingredients ?? [];
  const extracted: IngredientMetadata[] = [];

  for (const entry of rawList) {
    const ing = entry?.ingredient as IngredientMetadata | undefined;
    if (ing && typeof ing.name === 'string' && ing.name.trim().length > 0) {
      extracted.push(ing);
    }
  }

  return extracted;
}

function matchesSkinTypeToken(token: string, target: SkinType): boolean {
  const low = token.toLowerCase();
  if (target === 'Dry') return low.includes('dry') || low.includes('kering');
  if (target === 'Oily') return low.includes('oily') || low.includes('berminyak');
  if (target === 'Combination') {
    return low.includes('combination') || low.includes('kombinasi');
  }
  return low.includes('normal');
}

function evaluateSkinTypeScore(
  product: Product,
  ingredients: IngredientMetadata[],
  profile: SkinProfile
): { score: number; reason: string | null } {
  let skinTags = toStringArray(product.skinTypes);

  if (skinTags.length === 0) {
    const inferredTags = new Set<string>();
    for (const ing of ingredients) {
      for (const tag of toStringArray(ing.suitableSkin)) {
        inferredTags.add(tag);
      }
    }
    skinTags = Array.from(inferredTags);
  }

  if (skinTags.length === 0) {
    return { score: 15, reason: null };
  }

  const lowerTags = skinTags.map((s) => s.toLowerCase());
  const isUniversal = lowerTags.some((s) =>
    hasAnySubstring(s, ['all', 'semua', 'universal'])
  );
  const isExact = lowerTags.some((s) =>
    matchesSkinTypeToken(s, profile.skinType)
  );
  const hasSensitiveTag = lowerTags.some((s) => s.includes('sensit'));
  const hasAcneTag = lowerTags.some(
    (s) => s.includes('acne') || s.includes('jerawat')
  );

  let score = 4;
  let reason: string | null = null;

  if (isExact) {
    score = 28;
    reason = `Dirancang untuk ${SKIN_TYPE_LABELS[profile.skinType].toLowerCase()}`;
  } else if (isUniversal) {
    if (profile.skinType === 'Normal') {
      score = 27;
    } else if (profile.barrierStatus === 'compromised') {
      score = 22;
    } else {
      score = 24;
    }
    reason = 'Cocok untuk semua jenis kulit';
  } else {
    const compatibilityTable: Record<SkinType, Record<string, number>> = {
      Normal: { dry: 20, combination: 23, oily: 18, sensit: 24 },
      Combination: {
        oily: profile.skinTypeScore >= 0 ? 21 : 16,
        dry: profile.skinTypeScore < 0 ? 21 : 16,
        normal: 22,
        sensit: 20,
      },
      Dry: { normal: 18, combination: 14, sensit: 22, oily: 4 },
      Oily: { combination: 20, normal: 15, sensit: 16, dry: 4 },
    };

    const row = compatibilityTable[profile.skinType];
    for (const tag of lowerTags) {
      for (const [key, value] of Object.entries(row)) {
        if (tag.includes(key) && value > score) {
          score = value;
        }
      }
    }

    if (score >= 20) {
      reason = `Kompatibel dengan profil ${SKIN_TYPE_LABELS[profile.skinType].toLowerCase()}`;
    }
  }

  if (profile.isSensitive && hasSensitiveTag) {
    score = Math.min(30, score + 3);
    if (!reason) {
      reason = 'Diformulasikan ramah untuk kulit sensitif';
    }
  } else if (profile.isAcneProne && hasAcneTag) {
    score = Math.min(30, score + 2);
    if (!reason) {
      reason = 'Diformulasikan untuk kulit rentan berjerawat';
    }
  } else if (isExact) {
    score = 30;
  }

  return { score, reason };
}

function evaluateConcernScore(
  product: Product,
  ingredients: IngredientMetadata[],
  profile: SkinProfile
): { score: number; matchedConcerns: string[]; reason: string | null } {
  const productConcerns = toStringArray(product.concerns).map((c) =>
    c.toLowerCase()
  );

  const ingredientConcernsSet = new Set<string>();
  for (const ing of ingredients) {
    for (const c of toStringArray(ing.concerns)) {
      ingredientConcernsSet.add(c.toLowerCase());
    }
  }
  const combinedConcerns = Array.from(
    new Set([...productConcerns, ...ingredientConcernsSet])
  );

  const weightEntries = Object.entries(profile.concernWeights);

  if (weightEntries.length === 0) {
    const maintenanceScore = combinedConcerns.length > 0 ? 26 : 22;
    return {
      score: maintenanceScore,
      matchedConcerns: [],
      reason: 'Mendukung perawatan harian kulit seimbang',
    };
  }

  if (combinedConcerns.length === 0) {
    return { score: 12, matchedConcerns: [], reason: null };
  }

  let totalWeight = 0;
  let matchedWeight = 0;
  const matchedConcerns: string[] = [];

  for (const [concernKey, weight] of weightEntries) {
    totalWeight += weight;
    const synonyms = CONCERN_SYNONYMS[concernKey] ?? [concernKey];
    const isMatched = combinedConcerns.some((pc) =>
      hasAnySubstring(pc, synonyms)
    );
    if (isMatched) {
      matchedConcerns.push(concernKey);
      matchedWeight += weight;
    }
  }

  const effectiveTarget = Math.min(totalWeight, 2.2);
  const coverage =
    effectiveTarget > 0 ? Math.min(1, matchedWeight / effectiveTarget) : 0;

  const primaryConcern = profile.concerns[0];
  const primaryBonus =
    primaryConcern && matchedConcerns.includes(primaryConcern) ? 0.12 : 0;

  const score = Math.round(Math.min(1, coverage * 0.88 + primaryBonus) * 35);

  const sortedMatched = [...matchedConcerns].sort(
    (a, b) => (profile.concernWeights[b] ?? 0) - (profile.concernWeights[a] ?? 0)
  );

  const labels = sortedMatched
    .slice(0, 2)
    .map((key) => CONCERN_LABELS[key] ?? key);

  const reason =
    labels.length > 0 ? `Menargetkan ${labels.join(' & ')}` : null;

  return { score, matchedConcerns: sortedMatched, reason };
}

function buildTargetRoleWeights(
  profile: SkinProfile
): Record<IngredientRole, number> {
  const weights: Record<IngredientRole, number> = {
    barrier_hydration: 0,
    soothing: 0,
    acne_comedonal: 0,
    acne_inflammatory: 0,
    oil_control: 0,
    brightening: 0,
    anti_aging_texture: 0,
  };

  const cw = profile.concernWeights;

  if (
    profile.safetyFlags.prioritizeBarrierRepair ||
    profile.skinType === 'Dry'
  ) {
    weights.barrier_hydration = 1;
  }
  if (cw.dehydration) {
    weights.barrier_hydration = Math.max(
      weights.barrier_hydration,
      cw.dehydration
    );
  }

  if (profile.isSensitive || profile.barrierStatus !== 'healthy') {
    weights.soothing = 1;
  }
  if (cw.redness) {
    weights.soothing = Math.max(weights.soothing, cw.redness);
  }

  if (profile.isAcneProne || cw.acne || cw.blackheads) {
    if (profile.acneSubType === 'comedonal') {
      weights.acne_comedonal = Math.max(0.85, cw.blackheads ?? 0.8);
    } else if (profile.acneSubType === 'inflammatory') {
      weights.acne_inflammatory = Math.max(0.95, cw.acne ?? 0.85);
    } else {
      weights.acne_comedonal = Math.max(0.7, cw.blackheads ?? 0.6);
      weights.acne_inflammatory = Math.max(0.8, cw.acne ?? 0.7);
    }
  }

  if (profile.skinType === 'Oily' || cw['excess-oil']) {
    weights.oil_control = Math.max(0.7, cw['excess-oil'] ?? 0.6);
  }

  if (
    profile.hasDarkSpots ||
    cw['dark-spots'] ||
    cw.dullness ||
    cw['uneven-tone']
  ) {
    weights.brightening = Math.max(
      cw['dark-spots'] ?? 0,
      cw.dullness ?? 0,
      cw['uneven-tone'] ?? 0,
      0.7
    );
  }

  if (cw['fine-lines'] || cw['uneven-texture']) {
    weights.anti_aging_texture = Math.max(
      cw['fine-lines'] ?? 0,
      cw['uneven-texture'] ?? 0
    );
  }

  const totalRoleWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  if (totalRoleWeight === 0) {
    weights.barrier_hydration = 0.8;
    weights.soothing = 0.5;
    weights.brightening = 0.4;
  }

  if (profile.safetyFlags.avoidHarshActives) {
    weights.anti_aging_texture *= 0.4;
    weights.acne_comedonal *= 0.5;
  }

  return weights;
}

function evaluateIngredientSynergy(
  ingredients: IngredientMetadata[],
  profile: SkinProfile
): { score: number; beneficialIngredients: string[]; reason: string | null } {
  if (ingredients.length === 0) {
    return { score: 10, beneficialIngredients: [], reason: null };
  }

  const roleWeights = buildTargetRoleWeights(profile);
  const roleHits: Record<IngredientRole, number> = {
    barrier_hydration: 0,
    soothing: 0,
    acne_comedonal: 0,
    acne_inflammatory: 0,
    oil_control: 0,
    brightening: 0,
    anti_aging_texture: 0,
  };

  const beneficialSet = new Set<string>();

  for (const ing of ingredients) {
    const normalized = ing.name.toLowerCase();

    if (
      profile.safetyFlags.avoidHarshActives &&
      isStrongActiveIngredient(normalized)
    ) {
      continue;
    }

    for (const role of ALL_ROLES) {
      if (roleWeights[role] <= 0) continue;
      const matched = INGREDIENT_ROLE_MATCHERS[role].some((fn) =>
        fn(normalized)
      );
      if (matched) {
        roleHits[role] += 1;
        beneficialSet.add(ing.name);
      }
    }
  }

  let achievedSynergy = 0;
  for (const role of ALL_ROLES) {
    const hits = roleHits[role];
    if (hits > 0) {
      const diminishedFactor =
        1 + (hits >= 2 ? 0.45 : 0) + (hits >= 3 ? 0.15 : 0);
      achievedSynergy += roleWeights[role] * diminishedFactor;
    }
  }

  const activeRoleWeights = Object.values(roleWeights)
    .filter((w) => w > 0)
    .sort((a, b) => b - a);

  const topSum = activeRoleWeights
    .slice(0, 3)
    .reduce((sum, w) => sum + w, 0);
  const targetSynergy = Math.min(2.4, Math.max(0.8, topSum * 1.15));

  const score = Math.round(Math.min(1, achievedSynergy / targetSynergy) * 30);
  const beneficialIngredients = Array.from(beneficialSet);

  const reason =
    beneficialIngredients.length > 0
      ? `Diperkaya ${beneficialIngredients.slice(0, 2).join(' & ')}`
      : null;

  return { score, beneficialIngredients, reason };
}

function evaluateQualityBonus(product: Product): number {
  const rating = typeof product.rating === 'number' ? product.rating : null;
  const reviews =
    typeof product.reviewCount === 'number' && product.reviewCount > 0
      ? product.reviewCount
      : 0;

  if (rating === null || rating <= 0) {
    return 3;
  }

  const priorMean = 4.2;
  const priorWeight = 10;
  const bayesianRating =
    (reviews * rating + priorWeight * priorMean) / (reviews + priorWeight);
  const normalized = Math.max(0, Math.min(1, (bayesianRating - 3) / 2));

  return Math.round(normalized * 5);
}

function evaluateSafetyVeto(
  ingredients: IngredientMetadata[],
  profile: SkinProfile
): {
  penalty: number;
  warnings: string[];
  riskyIngredients: string[];
} {
  let penalty = 0;
  const warnings: string[] = [];
  const riskySet = new Set<string>();
  const triggeredKeys = new Set<string>();

  for (const ing of ingredients) {
    const normalized = ing.name.toLowerCase();

    if (profile.safetyFlags.avoidHarshActives || profile.isSensitive) {
      for (const rule of HARSH_IRRITANT_RULES) {
        if (!triggeredKeys.has(rule.key) && rule.test(normalized)) {
          triggeredKeys.add(rule.key);
          penalty += profile.safetyFlags.avoidHarshActives
            ? rule.penalty
            : (rule.moderatePenalty ?? rule.penalty);
          riskySet.add(ing.name);
          warnings.push(
            `Mengandung ${rule.label} yang berisiko untuk kulit sensitif`
          );
        }
      }
    }

    if (profile.safetyFlags.avoidHarshActives) {
      for (const rule of STRONG_ACTIVE_RULES) {
        if (!triggeredKeys.has(rule.key) && rule.test(normalized)) {
          triggeredKeys.add(rule.key);
          penalty += rule.penalty;
          riskySet.add(ing.name);
          warnings.push(
            `Mengandung ${rule.label} — kurang ideal saat skin barrier sedang sensitif`
          );
        }
      }
    }

    if (profile.safetyFlags.avoidComedogenic) {
      for (const rule of COMEDOGENIC_RULES) {
        if (!triggeredKeys.has(rule.key) && rule.test(normalized)) {
          triggeredKeys.add(rule.key);
          penalty += rule.penalty;
          riskySet.add(ing.name);
          warnings.push(`Mengandung ${rule.label}`);
        }
      }
    }

    if (profile.skinType === 'Dry' || profile.isDehydrated) {
      for (const rule of DRYING_AGENT_RULES) {
        if (!triggeredKeys.has(rule.key) && rule.test(normalized)) {
          triggeredKeys.add(rule.key);
          penalty += rule.penalty;
          riskySet.add(ing.name);
          warnings.push(
            `Mengandung ${rule.label} yang berpotensi membuat kulit makin kering`
          );
        }
      }
    }
  }

  return {
    penalty: Math.min(35, penalty),
    warnings,
    riskyIngredients: Array.from(riskySet),
  };
}

function classifyMatchTier(score: number): MatchTier {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 45) return 'moderate';
  return 'low';
}

function normalizeSkinType(value: unknown): SkinType {
  const low = String(value ?? '').toLowerCase().trim();
  if (low === 'dry' || low === 'kering') return 'Dry';
  if (low === 'oily' || low === 'berminyak') return 'Oily';
  if (low === 'combination' || low === 'kombinasi') return 'Combination';
  return 'Normal';
}

function normalizeProfile(raw: SkinProfile): SkinProfile {
  const skinType = normalizeSkinType(raw?.skinType);
  const concerns = Array.isArray(raw?.concerns) ? raw.concerns : [];

  const concernWeights: Record<string, number> =
    raw?.concernWeights && typeof raw.concernWeights === 'object'
      ? raw.concernWeights
      : Object.fromEntries(concerns.map((c) => [c, 0.8]));

  const isSensitive =
    typeof raw?.isSensitive === 'boolean'
      ? raw.isSensitive
      : concerns.includes('redness');
  const isAcneProne =
    typeof raw?.isAcneProne === 'boolean'
      ? raw.isAcneProne
      : concerns.includes('acne');
  const isDehydrated =
    typeof raw?.isDehydrated === 'boolean'
      ? raw.isDehydrated
      : concerns.includes('dehydration');
  const hasDarkSpots =
    typeof raw?.hasDarkSpots === 'boolean'
      ? raw.hasDarkSpots
      : concerns.includes('dark-spots');

  const barrierStatus =
    raw?.barrierStatus ??
    (isDehydrated && isSensitive
      ? 'compromised'
      : isDehydrated
        ? 'mildly-compromised'
        : 'healthy');

  const acneSubType =
    raw?.acneSubType ??
    (concerns.includes('blackheads') && !concerns.includes('acne')
      ? 'comedonal'
      : concerns.includes('acne')
        ? 'inflammatory'
        : 'none');

  const safetyFlags = raw?.safetyFlags ?? {
    avoidHarshActives: barrierStatus === 'compromised' || isSensitive,
    avoidComedogenic: isAcneProne,
    prioritizeBarrierRepair: barrierStatus !== 'healthy' || isDehydrated,
  };

  const skinTypeScore =
    typeof raw?.skinTypeScore === 'number'
      ? raw.skinTypeScore
      : skinType === 'Oily'
        ? 50
        : skinType === 'Dry'
          ? -50
          : 0;

  return {
    ...raw,
    skinType,
    skinTypeScore,
    isAcneProne,
    isSensitive,
    isDehydrated,
    hasDarkSpots,
    concerns,
    concernWeights,
    barrierStatus,
    acneSubType,
    safetyFlags,
  };
}

export function calculateMatchScore(
  product: Product,
  rawProfile: SkinProfile
): MatchResult {
  const profile = normalizeProfile(rawProfile);
  const ingredients = extractIngredients(product);

  const skinResult = evaluateSkinTypeScore(product, ingredients, profile);
  const concernResult = evaluateConcernScore(product, ingredients, profile);
  const ingredientResult = evaluateIngredientSynergy(ingredients, profile);
  const qualityBonus = evaluateQualityBonus(product);
  const safetyResult = evaluateSafetyVeto(ingredients, profile);

  let rawTotal =
    skinResult.score +
    concernResult.score +
    ingredientResult.score +
    qualityBonus -
    safetyResult.penalty;

  if (profile.safetyFlags.avoidHarshActives && safetyResult.penalty >= 16) {
    rawTotal = Math.min(rawTotal, 55);
  }

  const score = Math.max(0, Math.min(100, Math.round(rawTotal)));
  const matchTier = classifyMatchTier(score);

  const reasons: string[] = [];
  if (skinResult.reason) reasons.push(skinResult.reason);
  if (concernResult.reason) reasons.push(concernResult.reason);
  if (ingredientResult.reason) reasons.push(ingredientResult.reason);
  if (reasons.length === 0) {
    reasons.push('Produk perawatan kulit harian');
  }

  return {
    score,
    reasons: reasons.slice(0, 3),
    breakdown: {
      skinTypes: skinResult.score,
      concerns: concernResult.score,
      ingredients: ingredientResult.score,
      quality: qualityBonus,
      safetyPenalty: -safetyResult.penalty,
    },
    matchTier,
    warnings: safetyResult.warnings,
    matchedConcerns: concernResult.matchedConcerns,
    beneficialIngredients: ingredientResult.beneficialIngredients,
    riskyIngredients: safetyResult.riskyIngredients,
  };
}

export function rankProductsByMatch(
  products: Product[],
  profile: SkinProfile
): RankedProduct[] {
  return products
    .map((product) => ({
      product,
      match: calculateMatchScore(product, profile),
    }))
    .sort((a, b) => {
      if (b.match.score !== a.match.score) {
        return b.match.score - a.match.score;
      }
      if (a.match.warnings.length !== b.match.warnings.length) {
        return a.match.warnings.length - b.match.warnings.length;
      }
      return (b.product.rating ?? 0) - (a.product.rating ?? 0);
    });
}

export const MATCH_TIER_LABELS: Record<MatchTier, string> = {
  excellent: 'Sangat Cocok',
  good: 'Cocok',
  moderate: 'Cukup Sesuai',
  low: 'Kurang Disarankan',
};