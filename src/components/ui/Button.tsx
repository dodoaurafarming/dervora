import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-dervora-primary/50 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-dervora-primary text-dervora-cream hover:bg-dervora-primary/90',
    outline: 'border-2 border-dervora-primary text-dervora-primary bg-transparent hover:bg-dervora-primary hover:text-dervora-cream',
    ghost: 'text-dervora-dark bg-transparent hover:bg-dervora-beige/50',
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};