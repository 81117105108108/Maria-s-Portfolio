import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { getAllSettings } from '@/lib/db/settings';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

function darkenHex(hex: string, amount = 0.15): string {
  const c = hex.replace('#', '');
  if (c.length !== 6 && c.length !== 3) return hex;
  const full = c.length === 3 ? c.replace(/./g, '$&$&') : c;
  const [r, g, b] = full.match(/../g)!.map((v) => {
    const val = parseInt(v, 16);
    return Math.max(0, Math.round(val * (1 - amount)));
  });
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();

  return {
    title: {
      default: settings.home_hero_title || "Maria's Portfolio",
      template: `%s | ${settings.home_hero_title || "Maria's Portfolio"}`,
    },
    description: settings.home_hero_description || 'A curated collection of 3D modeling and creative work.',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSettings();
  const primaryColor = settings.site_primary_color || '#8a7658';
  const accentColor = settings.site_accent_color || '#1a1a2e';

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable}`}
      style={{
        '--color-primary': primaryColor,
        '--color-primary-hover': darkenHex(primaryColor),
        '--color-accent': accentColor,
      } as React.CSSProperties}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
