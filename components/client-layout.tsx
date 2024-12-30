'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { SessionProvider } from '@/lib/auth/session-provider';
import { DataProvider } from '@/lib/providers/data-provider';
import { NextIntlClientProvider } from 'next-intl';

interface ClientLayoutProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export function ClientLayout({ children, locale, messages }: ClientLayoutProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </SessionProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}