import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { FormField } from './FormField';
import { Button } from '../ui/Button';
import { adminCreateBrand, isApiSuccess, type Brand } from '../../lib/api';

interface QuickAddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (brand: Brand) => void;
}

interface BrandFormData {
  name: string;
  country: string;
  website: string;
}

const EMPTY_FORM: BrandFormData = {
  name: '',
  country: '',
  website: '',
};

export const QuickAddBrandModal: React.FC<QuickAddBrandModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<BrandFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData(EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen]);

  const updateField = <K extends keyof BrandFormData>(
    key: K,
    value: BrandFormData[K]
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
      validationErrors.name = 'Nama brand wajib diisi';
    } else if (formData.name.trim().length < 2) {
      validationErrors.name = 'Nama brand minimal 2 karakter';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Periksa kembali form Anda');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Menambah brand...');

    const response = await adminCreateBrand({
      name: formData.name.trim(),
      country: formData.country || undefined,
      website: formData.website || undefined,
    });

    if (isApiSuccess(response)) {
      toast.success('Brand berhasil ditambahkan!', { id: toastId });
      onSuccess(response.data);
      onClose();
    } else {
      if (response.error.code === 'CONFLICT') {
        toast.error('Brand dengan nama ini sudah ada', { id: toastId });
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
      title="Tambah Brand Baru"
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
        <FormField label="Nama Brand" required error={errors.name}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Contoh: Skintific"
            className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
          />
        </FormField>

        <FormField label="Negara (opsional)">
          <input
            type="text"
            value={formData.country}
            onChange={(e) => updateField('country', e.target.value)}
            placeholder="Contoh: Indonesia"
            className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
          />
        </FormField>

        <FormField label="Website (opsional)">
          <input
            type="url"
            value={formData.website}
            onChange={(e) => updateField('website', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-2.5 rounded-xl border border-dervora-beige bg-white focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 font-body text-sm"
          />
        </FormField>
      </form>
    </Modal>
  );
};