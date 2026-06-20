export const locales = ['en', 'ru'] as const;
export const defaultLocale = 'en';
export const localeCookieName = 'NEXT_LOCALE';

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'ru';
}
