import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { ImageUploader } from './ImageUploader';
import { Button } from '../ui/Button';
import {
  isApiSuccess,
  adminCreateCatalog,
  adminUpdateCatalog,
  adminUploadIngredientImage,
  type IngredientCatalog,
} from '../../lib/api';

interface CatalogFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: IngredientCatalog | null;
}

export const CatalogFormModal: React.FC<CatalogFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editData,
}) => {
  const isEdit = !!editData;
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: null as string | null,
    description: '',
    sourceLink: '',
    commonUsesText: '', // Disimpan sebagai string (dipisah koma)
    allergyPotential: '',
    skinTypeSummary: '',
    riskBenefit: '',
    category: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          name: editData.name,
          photoUrl: editData.photoUrl,
          description: editData.description || '',
          sourceLink: editData.sourceLink || '',
          commonUsesText: editData.commonUses ? editData.commonUses.join(', ') : '',
          allergyPotential: editData.allergyPotential || '',
          skinTypeSummary: editData.skinTypeSummary || '',
          riskBenefit: editData.riskBenefit || '',
          category: editData.category || '',
        });
      } else {
        setFormData({
          name: '', photoUrl: null, description: '', sourceLink: '',
          commonUsesText: '', allergyPotential: '', skinTypeSummary: '',
          riskBenefit: '', category: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, editData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Nama wajib diisi' });
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading(isEdit ? 'Menyimpan...' : 'Menambah...');

    // Ubah string koma menjadi array
    const commonUsesArray = formData.commonUsesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      name: formData.name.trim(),
      photoUrl: formData.photoUrl,
      description: formData.description || undefined,
      sourceLink: formData.sourceLink || undefined,
      commonUses: commonUsesArray,
      allergyPotential: formData.allergyPotential || undefined,
      skinTypeSummary: formData.skinTypeSummary || undefined,
      riskBenefit: formData.riskBenefit || undefined,
      category: formData.category || undefined,
    };

    const response = isEdit && editData
      ? await adminUpdateCatalog(editData.id, payload)
      : await adminCreateCatalog(payload);

    if (isApiSuccess(response)) {
      toast.success('Berhasil disimpan!', { id: toastId });
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
      title={isEdit ? 'Edit Catalog' : 'Tambah Catalog Baru'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Batal</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            <Save size={16} className="mr-2" /> {submitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <ImageUploader
          imageUrl={formData.photoUrl}
          imagePublicId={null}
          onChange={(url) => setFormData({ ...formData, photoUrl: url })}
          uploadFunction={adminUploadIngredientImage}
        />

        <FormField label="Nama Ingredient (Catalog)" required error={errors.name}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-dervora-beige"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Kategori (Aktif, Botani, dll)">
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-dervora-beige"
              placeholder="Aktif"
            />
          </FormField>
          <FormField label="Link Sumber">
            <input
              type="url"
              value={formData.sourceLink}
              onChange={(e) => setFormData({ ...formData, sourceLink: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-dervora-beige"
            />
          </FormField>
        </div>

        <FormField label="Deskripsi">
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-dervora-beige resize-none"
            rows={3}
          />
        </FormField>

        <FormField label="Kegunaan Umum (Pisahkan dengan koma)">
          <textarea
            value={formData.commonUsesText}
            onChange={(e) => setFormData({ ...formData, commonUsesText: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-dervora-beige resize-none"
            rows={2}
            placeholder="Melembapkan, Menenangkan kulit"
          />
        </FormField>

        <FormField label="Potensi Alergi">
          <textarea
            value={formData.allergyPotential}
            onChange={(e) => setFormData({ ...formData, allergyPotential: e.target.value })}
            className="w-full px-4 py-2 rounded-xl border border-dervora-beige resize-none"
            rows={2}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ringkasan Skin Type">
            <textarea
              value={formData.skinTypeSummary}
              onChange={(e) => setFormData({ ...formData, skinTypeSummary: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-dervora-beige resize-none"
              rows={2}
            />
          </FormField>
          <FormField label="Analisis Risiko/Manfaat">
            <textarea
              value={formData.riskBenefit}
              onChange={(e) => setFormData({ ...formData, riskBenefit: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-dervora-beige resize-none"
              rows={2}
            />
          </FormField>
        </div>
      </form>
    </Modal>
  );
};