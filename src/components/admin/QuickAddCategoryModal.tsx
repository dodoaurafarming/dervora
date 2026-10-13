import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { Button } from '../ui/Button';
import { adminCreateCategory, isApiSuccess, type Category } from '../../lib/api';

interface QuickAddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (category: Category) => void;
}

interface CategoryFormData {
  name: string;
  description: string;
}

const EMPTY_FORM: CategoryFormData = {
  name: '',
  description: '',
};

export const QuickAddCategoryModal: React.FC<QuickAddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CategoryFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  const updateField = <K extends keyof CategoryFormData>(
    key: K,
    value: CategoryFormData[K]
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
      validationErrors.name = 'Nama kategori wajib diisi';
    } else if (formData.name.trim().length < 2) {
      validationErrors.name = 'Nama kategori minimal 2 karakter';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Periksa kembali form Anda');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Menambahkan kategori...');

    const response = await adminCreateCategory({
      name: formData.name.trim(),
      description: formData.description || undefined,
    });

    if (isApiSuccess(response)) {
      toast.success('Kategori berhasil ditambahkan!', { id: toastId });
      onSuccess(response.data);
      onClose();
    } else {
      if (response.error.code === 'CONFLICT') {
        toast.error('Kategori dengan nama ini sudah ada.', { id: toastId });
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
      title="Tambah Kategori Baru"
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
        <FormField label="Nama Kategori" required error={errors.name}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Contoh: Essence"
            className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
          />
        </FormField>

        <FormField label="Deskripsi (opsional)">
          <textarea
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
            placeholder="Deskripsi singkat kategori..."
            className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm resize-none"
          />
        </FormField>
      </form>
    </Modal>
  );
};