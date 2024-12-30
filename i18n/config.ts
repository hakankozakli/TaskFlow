export const i18nConfig = {
  locales: ['en', 'es', 'fr', 'de'] as const,
  defaultLocale: 'en',
  localePrefix: 'as-needed' as const,
  timeZone: 'UTC',
} as const;

export type Locale = (typeof i18nConfig.locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
} as const;