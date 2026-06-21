'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  session: boolean;
}

export function MobileNav({ session }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-brand-600 hover:text-brand-800 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 right-0 z-50 w-64 bg-white border border-brand-200 rounded-lg shadow-lg p-4 m-2">
            <nav className="flex flex-col gap-2">
              <Link
                href="/projects"
                className="px-3 py-2 text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <hr className="my-2 border-brand-200" />
              <Link
                href={session ? '/admin' : '/login'}
                className="px-3 py-2 text-sm font-medium text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {session ? 'Admin' : 'Login'}
              </Link>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
