import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'danger',
  loading = false,
}) => {
  // Close on ESC
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      confirmBg: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      confirmBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      iconBg: 'bg-dervora-primary/10',
      iconColor: 'text-dervora-primary',
      confirmBg: 'bg-dervora-primary hover:bg-dervora-primary-dark text-dervora-cream',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      aria-modal="true"
      role="alertdialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dervora-dark/60 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-dervora-cream transition-colors disabled:opacity-50"
          aria-label="Tutup"
        >
          <X size={18} className="text-dervora-dark/60" />
        </button>

        {/* Icon */}
        <div className={`w-14 h-14 rounded-full ${styles.iconBg} flex items-center justify-center mb-4`}>
          <AlertTriangle size={28} className={styles.iconColor} />
        </div>

        {/* Title */}
        <h3 className="font-heading text-2xl font-bold text-dervora-dark mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="font-body text-base text-dervora-dark/70 leading-relaxed mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl font-body text-sm font-medium transition-colors disabled:opacity-50 ${styles.confirmBg}`}
          >
            {loading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};