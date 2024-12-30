import {getRequestConfig} from 'next-intl/server';
import {getUserLocale} from '@/lib/locale';

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  return {
    locale,
    now: new Date(),
    timeZone: 'Europe/Vienna',
    messages: (await import(`../messages/${locale}.json`)).default
  };
});