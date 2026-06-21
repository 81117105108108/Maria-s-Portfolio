import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-display font-bold text-brand-200">404</p>
        <h1 className="mt-4 text-2xl font-display font-semibold text-brand-800">
          Page Not Found
        </h1>
        <p className="mt-2 text-brand-500">
          This page doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-4 py-2 rounded-md bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
