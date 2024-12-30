'use client';

import { setUserLocale } from '@/lib/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { i18nConfig } from '@/i18n/config';
import { useCallback } from 'react';
import Cookies from 'js-cookie';

const languages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
} as const;

export function LanguageSelector({ variant = 'default' }: { variant?: 'default' | 'ghost' }) {
  const currentLocale = Cookies.get('NEXT_LOCALE') || i18nConfig.defaultLocale;

  const handleLanguageChange = useCallback((newLocale: string) => {
    setUserLocale(newLocale)
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="icon" className="h-8 w-8">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18nConfig.locales.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={currentLocale === lang ? 'bg-accent' : ''}
          >
            {languages[lang as keyof typeof languages]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}