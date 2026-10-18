import type { Product } from '../lib/api';
import type { SkinProfile } from './quizScoring';
import { CONCERN_LABELS } from './quizScoring';

export interface MatchResult {
  score: number;
  reasons: string[];
  breakdown: {
    skinTypes: number;
    concerns: number;
    ingredients: number;
  };
}

export function calculateMatchScore(
  product: Product,
  profile: SkinProfile
): MatchResult {
  let skinTypesScore = 0;
  let concernsScore = 0;
  let ingredientsScore = 0;
  const reasons: string[] = [];

  // ==================== 1. SKIN TYPE (Bobot 40%) ====================
  const productSkinTypes = product.skinTypes || [];
  const profileSkinType = profile.skinType;

  if (productSkinTypes.length > 0) {
    const isUniversal = productSkinTypes.some(s => s.toLowerCase() === 'all' || s.toLowerCase() === 'semua');
    const isMatch = productSkinTypes.some(s => s.toLowerCase() === profileSkinType.toLowerCase());

    if (isUniversal) {
      skinTypesScore = 35; // Skor tinggi untuk produk "All"
      reasons.push(`Cocok untuk semua jenis kulit`);
    } else if (isMatch) {
      skinTypesScore = 40; // Skor maksimal jika cocok persis
      reasons.push(`Cocok untuk kulit ${profileSkinType.toLowerCase()}`);
    } else {
      skinTypesScore = 10; // Skor minimal meskipun tidak cocok (toleransi)
    }
  } else {
    skinTypesScore = 15; // Default jika data kosong
  }

  // ==================== 2. CONCERNS (Bobot 40%) ====================
  const productConcerns = product.concerns || [];
  const userConcerns = profile.concerns;

  if (productConcerns.length > 0 && userConcerns.length > 0) {
    let matchedCount = 0;
    const matchedLabels: string[] = [];

    userConcerns.forEach(uc => {
      // Cek apakah concern user ada di produk (dengan pencocokan longgar)
      const found = productConcerns.find(pc => pc.toLowerCase().includes(uc.toLowerCase()) || uc.toLowerCase().includes(pc.toLowerCase()));
      if (found) {
        matchedCount++;
        matchedLabels.push(CONCERN_LABELS[uc] || uc);
      }
    });

    // Skor berdasarkan persentase concern yang tercakup
    const matchRatio = matchedCount / userConcerns.length;
    concernsScore = Math.round(matchRatio * 40);

    // TAMBAHKAN BONUS: Jika produk setidaknya meng-cover 1 concern user, beri skor minimal 20
    if (matchedCount > 0 && concernsScore < 20) concernsScore = 20;

    if (matchedLabels.length > 0) {
      reasons.push(`Membantu mengatasi ${matchedLabels.slice(0, 2).join(' & ')}`);
    }
  } else {
    concernsScore = 15; // Default jika data kosong
  }

  // ==================== 3. INGREDIENTS (Bobot 20%) ====================
  const productIngredients = product.ingredients.map((i) => i.ingredient.name);
  const premiumIngredients = [
    'Niacinamide', 'Salicylic', 'Hyaluronic', 'Ceramide', 
    'Centella', 'Panthenol', 'Vitamin C', 'Retinol', 'Peptide'
  ];

  let matchedIngredients = 0;
  const matchedIngs: string[] = [];
  
  productIngredients.forEach(ing => {
    if (premiumIngredients.some(pi => ing.toLowerCase().includes(pi.toLowerCase()))) {
      matchedIngredients++;
      matchedIngs.push(ing);
    }
  });

  if (matchedIngredients > 0) {
    // Maksimal 20 poin (1 bahan = 10 poin, 2+ bahan = 20 poin)
    ingredientsScore = Math.min(20, matchedIngredients * 10); 
    reasons.push(`Mengandung ${matchedIngs.slice(0, 2).join(' & ')}`);
  } else {
    ingredientsScore = 5; // Default jika tidak ada bahan premium
  }

  // ==================== TOTAL SCORE (Tanpa Bonus Terpisah) ====================
  // Skor maksimal sekarang: 40 (Skin) + 40 (Concerns) + 20 (Ingredients) = 100
  const totalScore = skinTypesScore + concernsScore + ingredientsScore;

  // Fallback reason
  if (reasons.length === 0) {
    reasons.push('Produk perawatan kulit harian');
  }

  return {
    score: totalScore,
    reasons: reasons.slice(0, 3),
    breakdown: {
      skinTypes: skinTypesScore,
      concerns: concernsScore,
      ingredients: ingredientsScore,
    },
  };
}