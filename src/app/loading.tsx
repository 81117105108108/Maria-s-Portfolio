import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-brand-500">Loading...</p>
      </div>
    </div>
  );
}
