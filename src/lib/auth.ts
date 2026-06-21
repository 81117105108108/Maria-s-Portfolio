import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { prisma } from './prisma';
import { loginSchema } from './validation';
import { rateLimit } from './rate-limit';

const authLimiter = rateLimit({ maxRequests: 10, windowMs: 60 * 1000 });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials, request) {
        const ip =
          request?.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ??
          request?.headers?.get('x-real-ip') ??
          'unknown';

        const { success } = authLimiter.check(`auth:${ip}`);
        if (!success) {
          return null;
        }

        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatarUrl,
        };
      },
    }),
  ],
});
