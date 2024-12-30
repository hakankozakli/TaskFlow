import { i18nConfig, type Locale } from './config';

/**
 * Load messages for a specific locale
 */
export async function getMessages(locale: string) {
  // Validate locale
  if (!i18nConfig.locales.includes(locale as Locale)) {
    console.warn(`Invalid locale: ${locale}, falling back to ${i18nConfig.defaultLocale}`);
    locale = i18nConfig.defaultLocale;
  }

  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to default locale
    if (locale !== i18nConfig.defaultLocale) {
      return getMessages(i18nConfig.defaultLocale);
    }
    return {};
  }
}