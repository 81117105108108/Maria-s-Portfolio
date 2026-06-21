'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brand-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors',
            error
              ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
              : 'border-brand-300',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-brand-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
