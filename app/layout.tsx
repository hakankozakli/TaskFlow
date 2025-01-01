import './globals.css';
import { Inter,Lexend, Red_Hat_Text, Onest, Montserrat } from 'next/font/google';
import { ClientLayout } from '@/components/client-layout';
import {getLocale, getMessages, getTimeZone} from 'next-intl/server';
import { Toaster } from '@/components/ui/sonner';

const inter = Onest({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  const locale = await getLocale();
  const timezone = await getTimeZone();
  
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout locale={locale} timezone={timezone} messages={messages}>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}