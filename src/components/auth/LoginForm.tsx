'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/lib/auth-actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700" role="alert">
          {state.error}
        </div>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="admin@example.com"
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        required
      />

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" loading={pending} className="w-full">
      Sign In
    </Button>
  );
}
