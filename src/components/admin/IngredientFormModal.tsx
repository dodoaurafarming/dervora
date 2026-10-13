import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { ImageUploader } from './ImageUploader';
import { Button } from '../ui/Button';
import {
  isApiSuccess,
  adminCreateIngredient,
  adminUpdateIngredient,
  adminUploadIngredientImage,
  type AdminIngredient,
} from '../../lib/api';

interface IngredientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editIngredient?: AdminIngredient | null;
}

interface IngredientFormData {
  name: string;
  function: string;
  description: string;
  sourceLink: string;
  photoUrl: string | null;
  photoPublicId: string | null;
  suitableSkin: string[];
  concerns: string[];
}

const EMPTY_FORM: IngredientFormData = {
  name: '',
  function: '',
  description: '',
  sourceLink: '',
  photoUrl: null,
  photoPublicId: null,
  suitableSkin: [],
  concerns: [],
};

const SKIN_TYPES = [
  'Normal',
  'Dry',
  'Oily',
  'Combination',
  'Sensitive',
  'Acne-prone',
  'All',
];

const CONCERNS = [
  'Acne',
  'Dark Spots',
  'Dullness',
  'Dryness',
  'Excess Oil',
  'Redness',
  'Uneven Texture',
  'Irritation',
  'Sensitivity',
  'Dehydration',
  'Sun protection',
  'Anti-Aging',
];

export const IngredientFormModal: React.FC<IngredientFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editIngredient,
}) => {
  const isEdit = !!editIngredient;

  const [formData, setFormData] = useState<IngredientFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (editIngredient) {
        setFormData({
          name: editIngredient.name,
          function: editIngredient.function || '',
          description: editIngredient.description || '',
          sourceLink: editIngredient.sourceLink || '',
          photoUrl: editIngredient.photoUrl,
          photoPublicId: editIngredient.photoPublicId,
          suitableSkin: editIngredient.suitableSkin || [],
          concerns: editIngredient.concerns || [],
        });
      } else {
        setFormData(EMPTY_FORM);
      }
      setErrors({});
    }
  }, [isOpen, editIngredient]);

  const updateField = <K extends keyof IngredientFormData>(
    key: K,
    value: IngredientFormData[K]
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

  const toggleArrayItem = (key: 'suitableSkin' | 'concerns', value: string) => {
    const current = formData[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(key, next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    const validationErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      validationErrors.name = 'Nama ingredient wajib diisi';
    } else if (formData.name.trim().length < 2) {
      validationErrors.name = 'Nama ingredient minimal 2 karakter';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Periksa kembali form Anda');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(
      isEdit ? 'Menyimpan perubahan...' : 'Menambah ingredient...'
    );

    // Prepare payload
    const payload = {
      name: formData.name.trim(),
      function: formData.function || undefined,
      description: formData.description || undefined,
      sourceLink: formData.sourceLink || undefined,
      photoUrl: formData.photoUrl || undefined,
      photoPublicId: formData.photoPublicId || undefined,
      suitableSkin:
        formData.suitableSkin.length > 0 ? formData.suitableSkin : undefined,
      concerns: formData.concerns.length > 0 ? formData.concerns : undefined,
    };

    const response =
      isEdit && editIngredient
        ? await adminUpdateIngredient(editIngredient.id, payload)
        : await adminCreateIngredient(payload);

    if (isApiSuccess(response)) {
      toast.success(
        isEdit
          ? 'Ingredient berhasil diupdate!'
          : 'Ingredient berhasil ditambahkan!',
        { id: toastId }
      );
      onSuccess();
      onClose();
    } else {
      toast.error(`Gagal: ${response.error.message}`, { id: toastId });
    }

    setSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Ingredient' : 'Tambah Ingredient Baru'}
      size="lg"
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
          imageUrl={formData.photoUrl}
          imagePublicId={formData.photoPublicId}
          onChange={(url, publicId) => {
            updateField('photoUrl', url);
            updateField('photoPublicId', publicId);
          }}
          uploadFunction={adminUploadIngredientImage}
        />

        {/* Section: Informasi Dasar */}
        <div>
          <h3 className="font-heading text-lg font-bold text-dervora-primary mb-4 pb-2 border-b border-dervora-beige">
            Informasi Dasar
          </h3>

          <div className="space-y-4">
            <FormField label="Nama Ingredient" required error={errors.name}>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Contoh: Niacinamide"
                className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
              />
            </FormField>

            <FormField label="Fungsi Utama">
              <textarea
                value={formData.function}
                onChange={(e) => updateField('function', e.target.value)}
                rows={2}
                placeholder="Contoh: Memperkuat skin barrier, mencerahkan, mengontrol minyak"
                className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm resize-none"
              />
            </FormField>

            <FormField label="Deskripsi Lengkap">
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows={3}
                placeholder="Deskripsi detail tentang ingredient ini..."
                className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm resize-none"
              />
            </FormField>

            <FormField label="Link Sumber (opsional)">
              <input
                type="url"
                value={formData.sourceLink}
                onChange={(e) => updateField('sourceLink', e.target.value)}
                placeholder="https://example.com/reference"
                className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
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
            <FormField label="Cocok Untuk (Skin Types)">
              <div className="flex flex-wrap gap-2">
                {SKIN_TYPES.map((type) => (
                  <label
                    key={type}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                      formData.suitableSkin.includes(type)
                        ? 'bg-dervora-primary text-dervora-cream border-dervora-primary'
                        : 'bg-white text-dervora-dark border-dervora-beige hover:border-dervora-primary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.suitableSkin.includes(type)}
                      onChange={() => toggleArrayItem('suitableSkin', type)}
                      className="sr-only"
                    />
                    <span className="font-body text-xs font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <FormField label="Membantu Mengatasi (Concerns)">
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
      </form>
    </Modal>
  );
};