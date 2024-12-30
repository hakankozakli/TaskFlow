import { getRequestConfig } from 'next-intl/server';
import { locales } from '@/lib/config/i18n';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`@/messages/${locale}.json`)).default,
  timeZone: 'UTC',
  now: new Date(),
}));