export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  matchScore: number;
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  description: string;
  size: string;
  bpom: string;
  halal: boolean;
  rating: number;
  reviewCount: number;
  howToUse: string;
  notes: string;
}

export interface Ingredient {
  id: string;
  name: string;
  function: string;
  suitableSkin: string[];
  concerns: string[];
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  type: 'single' | 'multiple';
}