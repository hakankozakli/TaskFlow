'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { DataProvider } from '@/app/providers/data-provider';
import { AuthProvider } from '@/app/providers/auth-provider';
import { NextIntlClientProvider } from 'next-intl';
import { SWRProvider } from '@/app/providers/swr-provider';

interface ClientLayoutProps {
  children: React.ReactNode;
  locale: string;
  timezone: string;
  messages: any;
}

export function ClientLayout({ children, locale, timezone, messages }: ClientLayoutProps) {
  return (
    <NextIntlClientProvider locale={locale} timeZone={timezone} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SWRProvider>
        <AuthProvider>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
        </SWRProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}