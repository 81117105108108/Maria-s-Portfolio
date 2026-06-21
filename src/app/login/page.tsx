import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-brand-900">
            Sign In
          </h1>
          <p className="mt-1 text-sm text-brand-500">
            Admin access only
          </p>
        </div>
        <div className="bg-white rounded-lg border border-brand-200 p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
