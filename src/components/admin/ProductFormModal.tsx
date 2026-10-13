import React, { useState, useEffect } from 'react';
import { Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { ImageUploader } from './ImageUploader';
import { Button } from '../ui/Button';
import { QuickAddBrandModal } from './QuickAddBrandModal';
import { QuickAddCategoryModal } from './QuickAddCategoryModal';
import { QuickAddIngredientModal } from './QuickAddIngredientModal';
import { useAdminBrands } from '../../hooks/useAdminBrands';
import { useAdminCategories } from '../../hooks/useAdminCategories';
import { useAdminIngredients } from '../../hooks/useAdminIngredients';
import {
  isApiSuccess,
  adminCreateProduct,
  adminUpdateProduct,
  type Product,
  type Brand,
  type Category,
  type AdminIngredient,
} from '../../lib/api';
import {
  validateProductForm,
  hasErrors,
  type ProductFormData,
  type FormErrors,
} from '../../utils/validation';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: Product | null;
}

const SKIN_TYPES = [
  'Normal', 'Dry', 'Oily', 'Combination', 'Sensitive', 'Acne-prone', 'All',
];

const CONCERNS = [
  'Acne', 'Dark Spots', 'Dullness', 'Dryness', 'Excess Oil', 'Redness',
  'Uneven Texture', 'Irritation', 'Sensitivity', 'Dehydration',
  'Sun protection', 'Anti-Aging',
];

const EMPTY_FORM: ProductFormData = {
  name: '',
  brandId: '',
  categoryId: '',
  description: '',
  price: '',
  size: '',
  halal: false,
  rating: '',
  reviewCount: '',
  howToUse: '',
  notes: '',
  bpom: '',
  imageUrl: null,
  imagePublicId: null,
  skinTypes: [],
  concerns: [],
  ingredientIds: [],
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editProduct,
}) => {
  const isEdit = !!editProduct;

  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');

  // Quick-add modal states
  const [quickAddBrand, setQuickAddBrand] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState(false);
  const [quickAddIngredient, setQuickAddIngredient] = useState(false);

  // Fetch dropdowns
  const { brands, loading: brandsLoading, refetch: refetchBrands } = useAdminBrands();
  const {
    categories,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useAdminCategories();
  const {
    ingredients,
    loading: ingredientsLoading,
    refetch: refetchIngredients,
  } = useAdminIngredients();

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (editProduct) {
        setFormData({
          name: editProduct.name,
          brandId: editProduct.brandId,
          categoryId: editProduct.categoryId || '',
          description: editProduct.description || '',
          price: editProduct.price ? String(editProduct.price) : '',
          size: editProduct.size || '',
          halal: editProduct.halal || false,
          rating: editProduct.rating ? String(editProduct.rating) : '',
          reviewCount: editProduct.reviewCount ? String(editProduct.reviewCount) : '',
          howToUse: editProduct.howToUse || '',
          notes: editProduct.notes || '',
          bpom: editProduct.bpom || '',
          imageUrl: editProduct.imageUrl,
          imagePublicId: editProduct.imagePublicId,
          skinTypes: editProduct.skinTypes || [],
          concerns: editProduct.concerns || [],
          ingredientIds: editProduct.ingredients.map((i) => i.ingredientId),
        });
      } else {
        setFormData(EMPTY_FORM);
      }
      setErrors({});
      setIngredientSearch('');
    }
  }, [isOpen, editProduct]);

  const updateField = <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const toggleArrayItem = (key: 'skinTypes' | 'concerns', value: string) => {
    const current = formData[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(key, next);
  };

  const toggleIngredient = (id: number) => {
    const current = formData.ingredientIds;
    const next = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    updateField('ingredientIds', next);
  };

  // Quick-add success handlers
  const handleBrandCreated = (newBrand: Brand) => {
    refetchBrands().then(() => {
      updateField('brandId', newBrand.id);
      toast.success(`Brand "${newBrand.name}" ditambahkan dan dipilih.`);
    });
  };

  const handleCategoryCreated = (newCategory: Category) => {
    refetchCategories().then(() => {
      updateField('categoryId', newCategory.id);
      toast.success(`Kategori "${newCategory.name}" ditambahkan dan dipilih.`);
    });
  };

  const handleIngredientCreated = (newIngredient: AdminIngredient) => {
    refetchIngredients().then(() => {
      updateField('ingredientIds', [...formData.ingredientIds, newIngredient.id]);
      toast.success(`Ingredient "${newIngredient.name}" ditambahkan dan dipilih.`);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProductForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      toast.error('Periksa kembali form Anda');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(isEdit ? 'Menyimpan perubahan...' : 'Menambah produk...');

    const payload = {
      name: formData.name.trim(),
      brandId: Number(formData.brandId),
      categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
      description: formData.description || undefined,
      price: formData.price ? Number(formData.price) : undefined,
      size: formData.size || undefined,
      halal: formData.halal,
      rating: formData.rating ? Number(formData.rating) : undefined,
      reviewCount: formData.reviewCount ? Number(formData.reviewCount) : undefined,
      howToUse: formData.howToUse || undefined,
      notes: formData.notes || undefined,
      bpom: formData.bpom || undefined,
      imageUrl: formData.imageUrl || undefined,
      imagePublicId: formData.imagePublicId || undefined,
      skinTypes: formData.skinTypes.length > 0 ? formData.skinTypes : undefined,
      concerns: formData.concerns.length > 0 ? formData.concerns : undefined,
      ingredientIds: formData.ingredientIds.length > 0 ? formData.ingredientIds : undefined,
    };

    const response =
      isEdit && editProduct
        ? await adminUpdateProduct(editProduct.id, payload)
        : await adminCreateProduct(payload);

    if (isApiSuccess(response)) {
      toast.success(
        isEdit ? 'Produk berhasil diupdate!' : 'Produk berhasil ditambahkan!',
        { id: toastId }
      );
      onSuccess();
      onClose();
    } else {
      toast.error(`Gagal: ${response.error.message}`, { id: toastId });
    }

    setSubmitting(false);
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(ingredientSearch.toLowerCase())
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={submitting}
            >
              <Save size={16} className="inline mr-2" />
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Uploader */}
          <ImageUploader
            imageUrl={formData.imageUrl}
            imagePublicId={formData.imagePublicId}
            onChange={(url, publicId) => {
              updateField('imageUrl', url);
              updateField('imagePublicId', publicId);
            }}
          />

          {/* Section: Informasi Dasar */}
          <div>
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-4 pb-2 border-b border-dervora-beige">
              Informasi Dasar
            </h3>

            <div className="space-y-4">
              <FormField label="Nama Produk" required error={errors.name}>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Contoh: Hydrating Serum"
                  className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Brand" required error={errors.brandId}>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      updateField('brandId', e.target.value ? Number(e.target.value) : '')
                    }
                    disabled={brandsLoading}
                    className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                  >
                    <option value="">Pilih brand...</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setQuickAddBrand(true)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-body text-dervora-primary hover:text-dervora-primary-dark transition-colors"
                  >
                    <Plus size={14} />
                    Tambah Brand Baru
                  </button>
                </FormField>

                <FormField label="Kategori" required error={errors.categoryId}>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      updateField('categoryId', e.target.value ? Number(e.target.value) : '')
                    }
                    disabled={categoriesLoading}
                    className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                  >
                    <option value="">Pilih kategori...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setQuickAddCategory(true)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-body text-dervora-primary hover:text-dervora-primary-dark transition-colors"
                  >
                    <Plus size={14} />
                    Tambah Kategori Baru
                  </button>
                </FormField>
              </div>

              <FormField label="Deskripsi">
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  placeholder="Deskripsi singkat produk..."
                  className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm resize-none"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Harga (Rp)" error={errors.price}>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="99000"
                    className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                  />
                </FormField>

                <FormField label="BPOM">
                  <input
                    type="text"
                    value={formData.bpom}
                    onChange={(e) => updateField('bpom', e.target.value)}
                    placeholder="NA18241234567"
                    className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Size">
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => updateField('size', e.target.value)}
                    placeholder="30ml"
                    className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                  />
                </FormField>

                <FormField label="Rating (0-5)" error={errors.rating}>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => updateField('rating', e.target.value)}
                    placeholder="4.8"
                    className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                  />
                </FormField>

                <FormField label="Terjual" error={errors.reviewCount}>
                  <input
                    type="number"
                    value={formData.reviewCount}
                    onChange={(e) => updateField('reviewCount', e.target.value)}
                    placeholder="Contoh: 100"
                    className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
                  />
                </FormField>
              </div>

              <FormField label="Halal">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.halal}
                    onChange={(e) => updateField('halal', e.target.checked)}
                    className="w-4 h-4 rounded border-dervora-beige text-dervora-primary focus:ring-dervora-primary"
                  />
                  <span className="font-body text-sm text-dervora-dark">
                    Produk ini halal
                  </span>
                </label>
              </FormField>
            </div>
          </div>

          {/* Section: Detail Perawatan */}
          <div>
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-4 pb-2 border-b border-dervora-beige">
              Detail Perawatan
            </h3>

            <div className="space-y-4">
              <FormField label="Cara Pakai">
                <textarea
                  value={formData.howToUse}
                  onChange={(e) => updateField('howToUse', e.target.value)}
                  rows={2}
                  placeholder="Contoh: Oleskan 2-3 tetes setelah toner..."
                  className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm resize-none"
                />
              </FormField>

              <FormField label="Catatan">
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={2}
                  placeholder="Contoh: Patch test sebelum penggunaan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm resize-none"
                />
              </FormField>
            </div>
          </div>

          {/* Section: Klasifikasi */}
          <div>
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-4 pb-2 border-b border-dervora-beige">
              Klasifikasi
            </h3>

            <div className="space-y-4">
              <FormField label="Skin Types">
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                        formData.skinTypes.includes(type)
                          ? 'bg-dervora-primary text-dervora-cream border-dervora-primary'
                          : 'bg-white text-dervora-dark border-dervora-beige hover:border-dervora-primary'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.skinTypes.includes(type)}
                        onChange={() => toggleArrayItem('skinTypes', type)}
                        className="sr-only"
                      />
                      <span className="font-body text-xs font-medium">{type}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Concerns">
                <div className="flex flex-wrap gap-2">
                  {CONCERNS.map((concern) => (
                    <label
                      key={concern}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                        formData.concerns.includes(concern)
                          ? 'bg-dervora-primary text-dervora-cream border-dervora-primary'
                          : 'bg-white text-dervora-dark border-dervora-beige hover:border-dervora-primary'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.concerns.includes(concern)}
                        onChange={() => toggleArrayItem('concerns', concern)}
                        className="sr-only"
                      />
                      <span className="font-body text-xs font-medium">{concern}</span>
                    </label>
                  ))}
                </div>
              </FormField>
            </div>
          </div>

          {/* Section: Ingredients */}
          <div>
            <h3 className="font-heading text-lg font-bold text-dervora-primary mb-4 pb-2 border-b border-dervora-beige">
              Ingredients
            </h3>

            <FormField
              label="Pilih Ingredients"
              hint={`${formData.ingredientIds.length} ingredient dipilih`}
            >
              <button
                type="button"
                onClick={() => setQuickAddIngredient(true)}
                className="mb-3 inline-flex items-center gap-1.5 text-xs font-body text-dervora-primary hover:text-dervora-primary-dark transition-colors"
              >
                <Plus size={14} />
                Tambah Ingredient Baru
              </button>

              <input
                type="text"
                value={ingredientSearch}
                onChange={(e) => setIngredientSearch(e.target.value)}
                placeholder="Cari ingredient..."
                className="w-full px-4 py-2 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm mb-3"
                disabled={ingredientsLoading}
              />

              <div className="max-h-60 overflow-y-auto border border-dervora-beige rounded-xl p-2 bg-white">
                {ingredientsLoading ? (
                  <p className="text-center py-4 font-body text-sm text-dervora-dark/50">
                    Memuat ingredients...
                  </p>
                ) : filteredIngredients.length === 0 ? (
                  <p className="text-center py-4 font-body text-sm text-dervora-dark/50">
                    Tidak ada ingredient yang cocok
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {filteredIngredients.map((ing) => (
                      <label
                        key={ing.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dervora-cream cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.ingredientIds.includes(ing.id)}
                          onChange={() => toggleIngredient(ing.id)}
                          className="w-4 h-4 rounded border-dervora-beige text-dervora-primary focus:ring-dervora-primary"
                        />
                        <span className="font-body text-sm text-dervora-dark">
                          {ing.name}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </FormField>
          </div>
        </form>
      </Modal>

      {/* Nested Quick-Add Modals */}
      <QuickAddBrandModal
        isOpen={quickAddBrand}
        onClose={() => setQuickAddBrand(false)}
        onSuccess={handleBrandCreated}
      />

      <QuickAddCategoryModal
        isOpen={quickAddCategory}
        onClose={() => setQuickAddCategory(false)}
        onSuccess={handleCategoryCreated}
      />

      <QuickAddIngredientModal
        isOpen={quickAddIngredient}
        onClose={() => setQuickAddIngredient(false)}
        onSuccess={handleIngredientCreated}
      />
    </>
  );
};