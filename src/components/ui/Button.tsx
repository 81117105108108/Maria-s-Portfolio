'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900',
    secondary:
      'border border-brand-300 bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100',
    ghost: 'text-brand-700 hover:bg-brand-100 active:bg-brand-200',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm rounded',
    md: 'h-10 px-4 text-sm rounded-md',
    lg: 'h-12 px-6 text-base rounded-md',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
}
