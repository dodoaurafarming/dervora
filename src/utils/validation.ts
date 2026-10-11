export interface ProductFormData {
  name: string;
  brandId: number | '';
  categoryId: number | '';
  description: string;
  price: string;
  size: string;
  halal: boolean;
  rating: string;
  reviewCount: string;
  howToUse: string;
  notes: string;
  bpom: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  skinTypes: string[];
  concerns: string[];
  ingredientIds: number[];
}

export interface FormErrors {
  [key: string]: string;
}

export function validateProductForm(data: ProductFormData): FormErrors {
  const errors: FormErrors = {};

  // Wajib
  if (!data.name.trim()) {
    errors.name = 'Nama produk wajib diisi';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Nama produk minimal 3 karakter';
  }

  if (!data.brandId) {
    errors.brandId = 'Brand wajib dipilih';
  }

  if (!data.categoryId) {
    errors.categoryId = 'Kategori wajib dipilih';
  }

  // Optional (tapi kalau diisi, harus valid)
  if (data.price && (isNaN(Number(data.price)) || Number(data.price) < 0)) {
    errors.price = 'Harga harus angka positif';
  }

  if (data.rating && (isNaN(Number(data.rating)) || Number(data.rating) < 0 || Number(data.rating) > 5)) {
    errors.rating = 'Rating harus antara 0-5';
  }

  if (data.reviewCount && (isNaN(Number(data.reviewCount)) || Number(data.reviewCount) < 0)) {
    errors.reviewCount = 'Review count harus angka positif';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}