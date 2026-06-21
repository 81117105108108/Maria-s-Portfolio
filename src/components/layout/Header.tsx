import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { auth } from '@/lib/auth';
import { MobileNav } from './MobileNav';

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-brand-200">
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-display font-semibold text-brand-800 hover:text-brand-600 transition-colors"
          >
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/projects"
              className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
            >
              Contact
            </Link>
            <Link
              href={session ? '/admin' : '/login'}
              className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
            >
              {session ? 'Admin' : 'Login'}
            </Link>
          </nav>

          {/* Mobile nav */}
          <MobileNav session={!!session} />
        </div>
      </div>
    </header>
  );
}
