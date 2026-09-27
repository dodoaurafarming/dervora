import type { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Gentle Hydrating Cleanser",
    brand: "Dervora",
    price: 95000,
    category: "Cleanser",
    image: "/images/products/cleanser.jpg",
    matchScore: 90,
    skinTypes: ["All", "Sensitive", "Dry"],
    concerns: ["Dryness", "Redness"],
    ingredients: ["Hyaluronic Acid", "Ceramide"],
    description: "Pembersih wajah lembut tanpa membuat kulit terasa ketarik."
  },
  {
    id: "p2",
    name: "Brightening Niacinamide Serum",
    brand: "Dervora",
    price: 125000,
    category: "Serum",
    image: "/images/products/serum.jpg",
    matchScore: 88,
    skinTypes: ["Normal", "Combination", "Oily"],
    concerns: ["Dullness", "Dark spots"],
    ingredients: ["Niacinamide 10%", "Centella Asiatica"],
    description: "Serum untuk mencerahkan wajah dan menyamarkan noda hitam."
  },
  {
    id: "p3",
    name: "Soothing Ceramide Moisturizer",
    brand: "Dervora",
    price: 145000,
    category: "Moisturizer",
    image: "/images/products/moisturizer.jpg",
    matchScore: 92,
    skinTypes: ["Dry", "Normal", "Sensitive"],
    concerns: ["Skin barrier", "Dryness"],
    ingredients: ["Ceramide", "Panthenol"],
    description: "Pelembap untuk memperbaiki skin barrier dan menenangkan kemerahan."
  },
  {
    id: "p4",
    name: "Daily Sunscreen SPF 50",
    brand: "Dervora",
    price: 139000,
    category: "Sunscreen",
    image: "/images/products/sunscreen.jpg",
    matchScore: 85,
    skinTypes: ["Normal", "Combination", "Oily"],
    concerns: ["Sun protection", "Dullness"],
    ingredients: ["Zinc Oxide", "Niacinamide"],
    description: "Sunscreen ringan dengan SPF 50 PA++++ untuk melindungi kulit dari sinar UV."
  }
];