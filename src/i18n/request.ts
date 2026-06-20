import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import englishMessages from '../../messages/en.json';
import russianMessages from '../../messages/ru.json';
import { defaultLocale, isLocale, localeCookieName } from './config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isLocale(savedLocale) ? savedLocale : defaultLocale;

  return {
    locale,
    messages: locale === 'ru' ? russianMessages : englishMessages,
    timeZone: 'UTC',
  };
});
