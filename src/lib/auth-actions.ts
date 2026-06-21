'use server';

import { AuthError } from 'next-auth';
import { loginSchema } from './validation';
import { signIn, signOut } from './auth';

export interface LoginState {
  error: string | null;
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: 'Enter a valid email and password.' };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/admin',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Invalid email or password.' };
    }

    throw error;
  }

  return { error: null };
}

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}
