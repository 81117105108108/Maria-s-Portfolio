'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-display font-bold text-brand-200">
          Oops!
        </p>
        <h1 className="mt-4 text-2xl font-display font-semibold text-brand-800">
          Something went wrong
        </h1>
        <p className="mt-2 text-brand-500">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try Again</Button>
          <Button
            variant="secondary"
            onClick={() => (window.location.href = '/')}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
