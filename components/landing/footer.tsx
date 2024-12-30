'use client';

import Link from 'next/link';
import { LanguageSelector } from '@/components/language/language-selector';

export function Footer() {
  return (
    <footer className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © 2024 TaskFlow. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6 items-center">
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Privacy
        </Link>
        <LanguageSelector variant="ghost" />
      </nav>
    </footer>
  );
}