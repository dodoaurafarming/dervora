import type { Product } from '../lib/api';
import type { SkinProfile } from './quizScoring';
import { CONCERN_LABELS } from './quizScoring';

export interface MatchResult {
  score: number;        // 0-100
  reasons: string[];    // Alasan cocok
  breakdown: {
    skinTypes: number;
    concerns: number;
    ingredients: number;
  };
}

/**
 * Hitung match score antara produk dan skin profile.
 *
 * Bobot:
 * - Skin type cocok: +30
 * - Concerns cocok: +40 (max)
 * - Ingredients cocok: +20 (max)
 * - Bonus: +10 jika produk cocok untuk dehydrated user
 *
 * Score di-normalize ke 0-100.
 */
export function calculateMatchScore(
  product: Product,
  profile: SkinProfile
): MatchResult {
  let skinTypesScore = 0;
  let concernsScore = 0;
  let ingredientsScore = 0;
  const reasons: string[] = [];

  // ==================== 1. SKIN TYPE (max 30) ====================
  const productSkinTypes = product.skinTypes || [];
  const profileSkinType = profile.skinType;

  if (productSkinTypes.length > 0) {
    const isUniversal = productSkinTypes.includes('All');
    const isMatch = productSkinTypes.includes(profileSkinType);

    if (isUniversal) {
      skinTypesScore = 25;
      reasons.push(`Cocok untuk semua jenis kulit`);
    } else if (isMatch) {
      skinTypesScore = 30;
      reasons.push(`Cocok untuk kulit ${profileSkinType.toLowerCase()}`);
    } else {
      skinTypesScore = 5; // minimal score
    }
  }

  // ==================== 2. CONCERNS (max 40) ====================
  const productConcerns = product.concerns || [];
  const userConcerns = profile.concerns;

  if (productConcerns.length > 0 && userConcerns.length > 0) {
    const matchedConcerns = userConcerns.filter((c) =>
      productConcerns.some((pc) => pc.toLowerCase().includes(c.toLowerCase()))
    );

    const matchRatio = matchedConcerns.length / userConcerns.length;
    concernsScore = Math.round(matchRatio * 40);

    if (matchedConcerns.length > 0) {
      const labels = matchedConcerns
        .slice(0, 3)
        .map((c) => CONCERN_LABELS[c] || c)
        .join(', ');
      reasons.push(`Membantu mengatasi ${labels}`);
    }
  }

  // ==================== 3. INGREDIENTS (max 20) ====================
  const productIngredients = product.ingredients.map((i) => i.ingredient.name);
  const premiumIngredients = [
    'Niacinamide',
    'Salicylic Acid',
    'Hyaluronic Acid',
    'Ceramide',
    'Centella Asiatica',
    'Panthenol',
  ];

  const matchedIngredients = productIngredients.filter((ing) =>
    premiumIngredients.some((pi) => ing.toLowerCase().includes(pi.toLowerCase()))
  );

  if (matchedIngredients.length > 0) {
    ingredientsScore = Math.min(20, matchedIngredients.length * 7);
    reasons.push(`Mengandung ${matchedIngredients.slice(0, 2).join(' & ')}`);
  }

  // ==================== 4. BONUS (max 10) ====================
  let bonusScore = 0;
  if (profile.isDehydrated) {
    const hasHydration = productConcerns.some((c) =>
      c.toLowerCase().includes('dryness') ||
      c.toLowerCase().includes('dehydration')
    );
    const hasHydratingIngredients = productIngredients.some((ing) =>
      ing.toLowerCase().includes('hyaluronic') ||
      ing.toLowerCase().includes('glycerin')
    );
    if (hasHydration || hasHydratingIngredients) {
      bonusScore = 10;
      reasons.push(`Membantu hidrasi kulit yang terdehidrasi`);
    }
  }

  // ==================== TOTAL SCORE ====================
  const totalScore = skinTypesScore + concernsScore + ingredientsScore + bonusScore;
  const normalizedScore = Math.min(100, totalScore);

  // Kalau tidak ada reason sama sekali, kasih fallback
  if (reasons.length === 0) {
    reasons.push('Produk skincare untuk perawatan harian');
  }

  return {
    score: normalizedScore,
    reasons: reasons.slice(0, 3), // max 3 reasons
    breakdown: {
      skinTypes: skinTypesScore,
      concerns: concernsScore,
      ingredients: ingredientsScore,
    },
  };
}