import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { getSetting } from '@/lib/db/settings';
import { Markdown } from '@/components/shared/Markdown';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${SITE_NAME}.`,
};

export const revalidate = 60;

export default async function AboutPage() {
  const rawContent = await getSetting('about_content');

  if (!rawContent) {
    return (
      <div className="container-page py-12 md:py-16 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-6">
            About
          </h1>
          <p className="text-brand-500 mb-4">
            Full-stack 3D artist and portfolio owner. Nothing here yet — Maria can write her story in the admin panel.
          </p>
          <p className="text-sm text-brand-500">
            <strong>Discord:</strong>{' '}
            <a
              href="https://discord.com/users/mariadantalion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              mariadantalion
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12 md:py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-6">
          About
        </h1>
        <Markdown content={rawContent} />
      </div>
    </div>
  );
}
