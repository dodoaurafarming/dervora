import { ALL_QUESTIONS } from '../data/quizData';

export interface SkinProfile {
  skinType: 'Dry' | 'Combination' | 'Oily';
  skinTypeScore: number;
  isAcneProne: boolean;
  acneScore: number;
  isSensitive: boolean;
  sensitiveScore: number;
  isDehydrated: boolean;
  dehydratedScore: number;
  hasDarkSpots: boolean;
  concerns: string[];
}

export function calculateSkinProfile(
  answers: Record<string, string | string[]>
): SkinProfile {
  // ==================== A. SKIN TYPE (Q1-Q7) ====================
  let dryScore = 0;
  let oilyScore = 0;

  const skinTypeQuestions = ALL_QUESTIONS.filter((q) => q.category === 'skin-type');

  skinTypeQuestions.forEach((q) => {
    const answer = answers[q.id] as string;
    if (!answer) return;

    const option = q.options.find((o) => o.value === answer);
    if (!option || !option.score) return;

    dryScore += option.score.dry || 0;
    oilyScore += option.score.oily || 0;
  });

  const skinTypeScore = oilyScore - dryScore;
  let skinType: 'Dry' | 'Combination' | 'Oily';

  if (skinTypeScore <= -3) {
    skinType = 'Dry';
  } else if (skinTypeScore >= 3) {
    skinType = 'Oily';
  } else {
    skinType = 'Combination';
  }

  // ==================== B. ACNE (Q8-Q12) ====================
  let acneScore = 0;
  const acneQuestions = ALL_QUESTIONS.filter((q) => q.category === 'acne');

  acneQuestions.forEach((q) => {
    const answer = answers[q.id] as string;
    if (!answer) return;

    const option = q.options.find((o) => o.value === answer);
    if (option?.score?.acne !== undefined) {
      acneScore += option.score.acne;
    }
  });

  const isAcneProne = acneScore >= 5;

  // ==================== C. SENSITIVE (Q13-Q17) ====================
  let sensitiveScore = 0;
  const sensitiveQuestions = ALL_QUESTIONS.filter((q) => q.category === 'sensitive');

  sensitiveQuestions.forEach((q) => {
    const answer = answers[q.id] as string;
    if (!answer) return;

    const option = q.options.find((o) => o.value === answer);
    if (option?.score?.sensitive !== undefined) {
      sensitiveScore += option.score.sensitive;
    }
  });

  const isSensitive = sensitiveScore >= 4;

  // ==================== D. DEHYDRATED (Q18) ====================
  let dehydratedScore = 0;
  const q18 = answers['q18'] as string;
  if (q18) {
    const map: Record<string, number> = {
      'never': 0,
      'rarely': 1,
      'sometimes': 2,
      'often': 3,
      'very-often': 4,
    };
    dehydratedScore = map[q18] || 0;
  }
  const isDehydrated = dehydratedScore >= 2;

  // ==================== E. DARK SPOTS (Q19) ====================
  const q19 = answers['q19'] as string;
  const hasDarkSpots = q19 !== 'none' && q19 !== undefined;

  // ==================== F. CONCERNS (Q20) ====================
  const q20 = answers['q20'] as string[] | undefined;
  const concerns = q20 || [];

  return {
    skinType,
    skinTypeScore,
    isAcneProne,
    acneScore,
    isSensitive,
    sensitiveScore,
    isDehydrated,
    dehydratedScore,
    hasDarkSpots,
    concerns,
  };
}

/**
 * Helper untuk label concerns yang user-friendly.
 */
export const CONCERN_LABELS: Record<string, string> = {
  'acne': 'Jerawat',
  'blackheads': 'Komedo/Pori Tersumbat',
  'excess-oil': 'Minyak Berlebih',
  'dehydration': 'Kulit Kering/Dehidrasi',
  'dullness': 'Kulit Kusam',
  'dark-spots': 'Bekas Jerawat/Dark Spots',
  'uneven-tone': 'Warna Kulit Tidak Merata',
  'redness': 'Kemerahan',
  'uneven-texture': 'Tekstur Kulit Tidak Rata',
  'fine-lines': 'Garis Halus/Kerutan',
  'other': 'Lainnya',
};