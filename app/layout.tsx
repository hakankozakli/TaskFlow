import './globals.css';
import { Inter } from 'next/font/google';
import { ClientLayout } from '@/components/client-layout';
import {getLocale, getMessages} from 'next-intl/server';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout locale={locale} messages={messages}>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}