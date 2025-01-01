'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { DataProvider } from '@/app/providers/data-provider';
import { AuthProvider } from '@/app/providers/auth-provider';
import { fetchAuthState } from '@/lib/auth/fetcher';
import { NextIntlClientProvider } from 'next-intl';

interface ClientLayoutProps {
  children: React.ReactNode;
  locale: string;
  timezone: string;
  messages: any;
}

export async function ClientLayout({ children, locale, timezone, messages }: ClientLayoutProps) {

  const initialState = await fetchAuthState()
  return (
    <NextIntlClientProvider locale={locale} timeZone={timezone} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider initialState={initialState}>
          <DataProvider>
            {children}
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}