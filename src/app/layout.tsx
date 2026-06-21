import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
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

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfairDisplay.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
