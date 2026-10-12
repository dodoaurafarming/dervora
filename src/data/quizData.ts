export interface QuizOption {
  value: string;
  label: string;
  score?: {
    dry?: number;
    oily?: number;
    acne?: number;
    sensitive?: number;
  };
}

export interface QuizQuestion {
  id: string;
  category: 'skin-type' | 'acne' | 'sensitive' | 'concerns';
  question: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
  allowOther?: boolean;
}

// ==================== A. SKIN TYPE (Q1-Q7) ====================
const SKIN_TYPE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'skin-type',
    question: 'Setelah mencuci wajah dan tidak menggunakan skincare selama 2–3 jam, bagaimana kondisi kulitmu?',
    type: 'single',
    options: [
      { value: 'very-dry', label: 'Sangat kering dan terasa tertarik', score: { dry: 3 } },
      { value: 'dry', label: 'Terasa agak kering', score: { dry: 2 } },
      { value: 'normal', label: 'Terasa nyaman/normal', score: {} },
      { value: 'oily-some', label: 'Mulai berminyak di beberapa area', score: { oily: 2 } },
      { value: 'oily-all', label: 'Berminyak di hampir seluruh wajah', score: { oily: 3 } },
    ],
  },
  {
    id: 'q2',
    category: 'skin-type',
    question: 'Saat bangun tidur sebelum menggunakan skincare, bagaimana kondisi kulit wajahmu?',
    type: 'single',
    options: [
      { value: 'very-dry', label: 'Sangat kering', score: { dry: 3 } },
      { value: 'dry', label: 'Kering di beberapa bagian', score: { dry: 2 } },
      { value: 'normal', label: 'Normal dan nyaman', score: {} },
      { value: 'oily-tzone', label: 'Berminyak di T-zone', score: { oily: 2 } },
      { value: 'oily-all', label: 'Berminyak hampir di seluruh wajah', score: { oily: 3 } },
    ],
  },
  {
    id: 'q3',
    category: 'skin-type',
    question: 'Setelah mencuci wajah, seberapa sering kulitmu terasa kencang atau tertarik?',
    type: 'single',
    options: [
      { value: 'always', label: 'Selalu', score: { dry: 3 } },
      { value: 'often', label: 'Sering', score: { dry: 2 } },
      { value: 'sometimes', label: 'Kadang-kadang', score: { dry: 1 } },
      { value: 'rarely', label: 'Jarang', score: {} },
      { value: 'never', label: 'Tidak pernah', score: { oily: 1 } },
    ],
  },
  {
    id: 'q4',
    category: 'skin-type',
    question: 'Berapa lama setelah mencuci wajah kulitmu biasanya mulai terlihat berminyak?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah berminyak', score: { dry: 3 } },
      { value: '5h', label: '5 jam atau lebih', score: { dry: 1 } },
      { value: '2-4h', label: '2–4 jam', score: {} },
      { value: '1h', label: 'Sekitar 1 jam', score: { oily: 2 } },
      { value: 'less-1h', label: 'Kurang dari 1 jam', score: { oily: 3 } },
    ],
  },
  {
    id: 'q5',
    category: 'skin-type',
    question: 'Bagian wajah mana yang paling sering terlihat berminyak?',
    type: 'single',
    options: [
      { value: 'none', label: 'Tidak ada', score: { dry: 2 } },
      { value: 'nose', label: 'Hanya hidung atau dahi', score: { oily: 1 } },
      { value: 'tzone', label: 'Dahi dan hidung (T-zone)', score: { oily: 2 } },
      { value: 'tzone-chin', label: 'Dahi, hidung, dan dagu', score: { oily: 2 } },
      { value: 'all', label: 'Hampir seluruh wajah', score: { oily: 3 } },
    ],
  },
  {
    id: 'q6',
    category: 'skin-type',
    question: 'Seberapa sering kamu membutuhkan moisturizer agar kulit terasa nyaman?',
    type: 'single',
    options: [
      { value: 'never', label: 'Hampir tidak pernah', score: { oily: 2 } },
      { value: 'rarely', label: 'Sesekali', score: { oily: 1 } },
      { value: 'once', label: 'Sekali sehari', score: {} },
      { value: 'twice', label: 'Dua kali sehari', score: { dry: 2 } },
      { value: 'more', label: 'Lebih dari dua kali sehari', score: { dry: 3 } },
    ],
  },
  {
    id: 'q7',
    category: 'skin-type',
    question: 'Jika tidak menggunakan moisturizer setelah mencuci wajah, apa yang biasanya terjadi?',
    type: 'single',
    options: [
      { value: 'nothing', label: 'Tidak ada perubahan', score: { oily: 1 } },
      { value: 'slightly-dry', label: 'Kulit sedikit kering', score: { dry: 1 } },
      { value: 'tight', label: 'Kulit terasa kencang/tertarik', score: { dry: 2 } },
      { value: 'dry-rough', label: 'Kulit menjadi kering atau kasar', score: { dry: 2 } },
      { value: 'very-uncomfortable', label: 'Kulit terasa sangat tidak nyaman', score: { dry: 3 } },
    ],
  },
];

// ==================== B. ACNE (Q8-Q12) ====================
const ACNE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q8',
    category: 'acne',
    question: 'Seberapa sering kamu mengalami komedo atau pori-pori tersumbat?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah', score: { acne: 0 } },
      { value: 'rarely', label: 'Jarang', score: { acne: 1 } },
      { value: 'sometimes', label: 'Kadang-kadang', score: { acne: 2 } },
      { value: 'often', label: 'Sering', score: { acne: 3 } },
      { value: 'very-often', label: 'Sangat sering', score: { acne: 4 } },
    ],
  },
  {
    id: 'q9',
    category: 'acne',
    question: 'Di bagian mana komedo atau pori tersumbat paling sering muncul?',
    type: 'single',
    options: [
      { value: 'none', label: 'Tidak ada', score: { acne: 0 } },
      { value: 'nose', label: 'Hidung', score: { acne: 1 } },
      { value: 'nose-around', label: 'Hidung dan sekitar hidung', score: { acne: 2 } },
      { value: 'tzone', label: 'T-zone (dahi, hidung, dagu)', score: { acne: 3 } },
      { value: 'tzone-cheek', label: 'T-zone dan pipi', score: { acne: 4 } },
    ],
  },
  {
    id: 'q10',
    category: 'acne',
    question: 'Seberapa sering kamu mengalami jerawat aktif?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah', score: { acne: 0 } },
      { value: 'rarely', label: 'Jarang', score: { acne: 1 } },
      { value: 'sometimes', label: 'Kadang-kadang', score: { acne: 2 } },
      { value: 'often', label: 'Sering', score: { acne: 3 } },
      { value: 'very-often', label: 'Sangat sering', score: { acne: 4 } },
    ],
  },
  {
    id: 'q11',
    category: 'acne',
    question: 'Dalam satu bulan terakhir, kira-kira berapa kali muncul jerawat baru?',
    type: 'single',
    options: [
      { value: 'none', label: 'Tidak ada', score: { acne: 0 } },
      { value: '1-2', label: '1–2 kali', score: { acne: 1 } },
      { value: '3-5', label: '3–5 kali', score: { acne: 2 } },
      { value: '6-10', label: '6–10 kali', score: { acne: 3 } },
      { value: 'more-10', label: 'Lebih dari 10 kali', score: { acne: 4 } },
    ],
  },
  {
    id: 'q12',
    category: 'acne',
    question: 'Jenis jerawat atau masalah acne apa yang paling sering kamu alami?',
    type: 'single',
    options: [
      { value: 'none', label: 'Tidak mengalami jerawat', score: { acne: 0 } },
      { value: 'whiteheads', label: 'Komedo/whiteheads', score: { acne: 1 } },
      { value: 'blackheads', label: 'Blackheads', score: { acne: 1 } },
      { value: 'small-red', label: 'Jerawat kecil dan kemerahan', score: { acne: 2 } },
      { value: 'inflamed', label: 'Jerawat bernanah atau meradang', score: { acne: 3 } },
      { value: 'multiple', label: 'Beberapa jenis sekaligus', score: { acne: 4 } },
    ],
  },
];

// ==================== C. SENSITIVE (Q13-Q17) ====================
const SENSITIVE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q13',
    category: 'sensitive',
    question: 'Seberapa sering wajahmu mengalami kemerahan atau flushing?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah', score: { sensitive: 0 } },
      { value: 'rarely', label: 'Jarang', score: { sensitive: 1 } },
      { value: 'sometimes', label: 'Kadang-kadang', score: { sensitive: 2 } },
      { value: 'often', label: 'Sering', score: { sensitive: 3 } },
      { value: 'very-often', label: 'Sangat sering', score: { sensitive: 4 } },
    ],
  },
  {
    id: 'q14',
    category: 'sensitive',
    question: 'Apakah kulitmu pernah terasa perih, menyengat, panas, atau terbakar setelah menggunakan skincare?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah', score: { sensitive: 0 } },
      { value: 'rarely', label: 'Jarang', score: { sensitive: 1 } },
      { value: 'sometimes', label: 'Kadang-kadang', score: { sensitive: 2 } },
      { value: 'often', label: 'Sering', score: { sensitive: 3 } },
      { value: 'almost-always', label: 'Hampir setiap kali', score: { sensitive: 4 } },
    ],
  },
  {
    id: 'q15',
    category: 'sensitive',
    question: 'Apakah kulitmu pernah mengalami iritasi setelah menggunakan produk skincare tertentu?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah', score: { sensitive: 0 } },
      { value: 'once', label: 'Pernah satu kali', score: { sensitive: 1 } },
      { value: 'few', label: 'Pernah beberapa kali', score: { sensitive: 2 } },
      { value: 'often', label: 'Sering', score: { sensitive: 3 } },
      { value: 'almost-always', label: 'Hampir setiap menggunakan produk tertentu', score: { sensitive: 4 } },
    ],
  },
  {
    id: 'q16',
    category: 'sensitive',
    question: 'Apakah kamu memiliki produk skincare tertentu yang tidak bisa digunakan karena menyebabkan reaksi pada kulit?',
    type: 'single',
    options: [
      { value: 'none', label: 'Tidak ada', score: { sensitive: 0 } },
      { value: 'one', label: 'Ada 1 produk', score: { sensitive: 1 } },
      { value: 'few', label: 'Ada beberapa produk', score: { sensitive: 2 } },
      { value: 'many', label: 'Banyak produk menyebabkan reaksi', score: { sensitive: 3 } },
      { value: 'unsure', label: 'Tidak yakin produk mana yang menyebabkan reaksi', score: { sensitive: 1 } },
    ],
  },
  {
    id: 'q17',
    category: 'sensitive',
    question: 'Apakah kulitmu mudah mengalami reaksi ketika mencoba produk skincare baru?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah', score: { sensitive: 0 } },
      { value: 'rarely', label: 'Jarang', score: { sensitive: 1 } },
      { value: 'sometimes', label: 'Kadang-kadang', score: { sensitive: 2 } },
      { value: 'often', label: 'Sering', score: { sensitive: 3 } },
      { value: 'almost-always', label: 'Hampir selalu', score: { sensitive: 4 } },
    ],
  },
];

// ==================== D. CONCERNS (Q18-Q20) ====================
const CONCERNS_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q18',
    category: 'concerns',
    question: 'Apakah kulitmu sering terasa kasar, bersisik, atau mengalami pengelupasan?',
    type: 'single',
    options: [
      { value: 'never', label: 'Tidak pernah', score: {} },
      { value: 'rarely', label: 'Jarang', score: {} },
      { value: 'sometimes', label: 'Kadang-kadang', score: {} },
      { value: 'often', label: 'Sering', score: {} },
      { value: 'very-often', label: 'Sangat sering', score: {} },
    ],
  },
  {
    id: 'q19',
    category: 'concerns',
    question: 'Apakah kamu memiliki masalah warna kulit yang tidak merata, bekas jerawat, atau dark spots yang ingin diperbaiki?',
    type: 'single',
    options: [
      { value: 'none', label: 'Tidak ada', score: {} },
      { value: 'little', label: 'Ada sedikit', score: {} },
      { value: 'some', label: 'Ada beberapa', score: {} },
      { value: 'many', label: 'Cukup banyak', score: {} },
      { value: 'very-many', label: 'Sangat banyak dan menjadi masalah utama', score: {} },
    ],
  },
  {
    id: 'q20',
    category: 'concerns',
    question: 'Apa masalah kulit yang paling ingin kamu atasi saat ini?',
    type: 'multiple',
    options: [
      { value: 'acne', label: 'Jerawat', score: {} },
      { value: 'blackheads', label: 'Komedo/pori tersumbat', score: {} },
      { value: 'excess-oil', label: 'Minyak berlebih', score: {} },
      { value: 'dehydration', label: 'Kulit kering/dehidrasi', score: {} },
      { value: 'dullness', label: 'Kulit kusam', score: {} },
      { value: 'dark-spots', label: 'Bekas jerawat/dark spots', score: {} },
      { value: 'uneven-tone', label: 'Warna kulit tidak merata', score: {} },
      { value: 'redness', label: 'Kemerahan', score: {} },
      { value: 'uneven-texture', label: 'Tekstur kulit tidak rata', score: {} },
      { value: 'fine-lines', label: 'Garis halus/kerutan', score: {} },
      { value: 'other', label: 'Lainnya', score: {} },
    ],
    allowOther: true,
  },
];

// ==================== ALL QUESTIONS ====================
export const ALL_QUESTIONS: QuizQuestion[] = [
  ...SKIN_TYPE_QUESTIONS,
  ...ACNE_QUESTIONS,
  ...SENSITIVE_QUESTIONS,
  ...CONCERNS_QUESTIONS,
];

export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;

// ==================== CATEGORY LABELS ====================
export const CATEGORY_LABELS: Record<QuizQuestion['category'], string> = {
  'skin-type': 'Kondisi Kulit',
  'acne': 'Kecenderungan Acne',
  'sensitive': 'Sensitivitas Kulit',
  'concerns': 'Skin Concerns',
};