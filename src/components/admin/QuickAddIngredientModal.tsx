import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { Button } from '../ui/Button';
import {
  adminCreateIngredient,
  isApiSuccess,
  type AdminIngredient,
} from '../../lib/api';

interface QuickAddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ingredient: AdminIngredient) => void;
}

interface IngredientFormData {
  name: string;
  function: string;
}

const EMPTY_FORM: IngredientFormData = {
  name: '',
  function: '',
};

export const QuickAddIngredientModal: React.FC<QuickAddIngredientModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<IngredientFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

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
    const toastId = toast.loading('Menambah ingredient...');

    const response = await adminCreateIngredient({
      name: formData.name.trim(),
      function: formData.function || undefined,
    });

    if (isApiSuccess(response)) {
      toast.success('Ingredient berhasil ditambahkan!', { id: toastId });
      onSuccess(response.data);
      onClose();
    } else {
      if (response.error.code === 'CONFLICT') {
        toast.error('Ingredient dengan nama ini sudah ada', { id: toastId });
      } else {
        toast.error(`Gagal: ${response.error.message}`, { id: toastId });
      }
    }

    setSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Ingredient Baru"
      size="md"
      zIndex={110}
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Nama Ingredient" required error={errors.name}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Contoh: Niacinamide"
            className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
          />
        </FormField>

        <FormField label="Fungsi Utama (opsional)">
          <textarea
            value={formData.function}
            onChange={(e) => updateField('function', e.target.value)}
            rows={2}
            placeholder="Contoh: Memperkuat skin barrier, mencerahkan"
            className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm resize-none"
          />
        </FormField>

        <p className="font-body text-xs text-dervora-dark/50 italic">
          Info lengkap (deskripsi, foto, dll) bisa diisi nanti dari halaman Admin &gt; Ingredients.
        </p>
      </form>
    </Modal>
  );
};