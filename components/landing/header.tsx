'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Kanban } from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import { ModeToggle } from '../mode-toggle';
import {useTranslations} from 'next-intl';
import { LanguageSelector } from '@/components/language/language-selector';

export function Header() {
  const { session } = useAuth();
  const t = useTranslations('nav');
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <Kanban className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl">TaskFlow</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            {t('features')}
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            {t('pricing')}
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#about">
            {t('about')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ModeToggle />
          {session ? (
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">{t('dashboard')}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t('login')}</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/signup">{t('signup')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}