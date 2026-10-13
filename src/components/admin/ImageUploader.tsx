import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminUploadImage, isApiSuccess } from '../../lib/api';
import type { ApiResponse } from '../../lib/api';

interface ImageUploaderProps {
  imageUrl: string | null;
  imagePublicId: string | null;
  onChange: (url: string | null, publicId: string | null) => void;
  uploadFunction?: (
    file: File
  ) => Promise<ApiResponse<{ url: string; publicId: string }>>;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl,
  imagePublicId,
  onChange,
  uploadFunction,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format file harus JPG, PNG, atau WebP');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Mengupload gambar...');

    const uploadFn = uploadFunction || adminUploadImage;
    const response = await uploadFn(file);

    if (isApiSuccess<{ url: string; publicId: string }>(response)) {
      onChange(response.data.url, response.data.publicId);
      toast.success('Gambar berhasil diupload!', { id: toastId });
    } else {
      toast.error(`Gagal upload: ${response.error.message}`, { id: toastId });
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = () => {
    onChange(null, null);
    toast.success('Gambar dihapus');
  };

  return (
    <div>
      <label className="block font-body text-sm font-medium text-dervora-dark mb-2">
        Gambar
      </label>

      {imageUrl ? (
        // Preview
        <div className="relative w-full max-w-xs">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full aspect-square object-cover rounded-2xl border-2 border-dervora-beige"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-red-50 transition-colors"
            aria-label="Hapus gambar"
          >
            <X size={16} className="text-red-500" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-md font-body text-xs font-medium text-dervora-primary hover:bg-white transition-colors disabled:opacity-50"
          >
            Ganti Gambar
          </button>
        </div>
      ) : (
        // Empty State
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-xs aspect-square rounded-2xl border-2 border-dashed border-dervora-beige bg-dervora-cream/30 flex flex-col items-center justify-center gap-3 hover:border-dervora-primary hover:bg-dervora-cream/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 size={32} className="text-dervora-primary animate-spin" />
              <span className="font-body text-sm text-dervora-dark/60">Mengupload...</span>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-full bg-dervora-primary/10 flex items-center justify-center">
                <Upload size={24} className="text-dervora-primary" />
              </div>
              <span className="font-body text-sm font-medium text-dervora-primary">
                Upload Gambar
              </span>
              <span className="font-body text-xs text-dervora-dark/50">
                JPG, PNG, atau WebP. Maks 5MB.
              </span>
            </>
          )}
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Show publicId info (dev mode) */}
      {imagePublicId && (
        <p className="font-body text-xs text-dervora-dark/40 mt-2 truncate">
          ID: {imagePublicId}
        </p>
      )}
    </div>
  );
};