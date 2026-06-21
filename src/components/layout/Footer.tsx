import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-200 bg-white mt-auto">
      <div className="container-page py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-brand-500">
            &copy; {year} {SITE_NAME}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-sm text-brand-400 italic">
              Built with care
            </span>
            <a
              href="https://discord.com/users/mariadantalion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-500 hover:text-accent transition-colors"
            >
              Discord: mariadantalion
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
