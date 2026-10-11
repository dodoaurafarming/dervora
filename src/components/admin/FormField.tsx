import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  hint,
}) => {
  return (
    <div>
      <label className="block font-body text-sm font-medium text-dervora-dark mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}

      {hint && !error && (
        <p className="font-body text-xs text-dervora-dark/50 mt-1">{hint}</p>
      )}

      {error && (
        <p className="font-body text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};