import { getRequestConfig } from 'next-intl/server';
import englishMessages from '../../messages/en.json';
import { defaultLocale } from './config';

export default getRequestConfig(() => ({
  locale: defaultLocale,
  messages: englishMessages,
  timeZone: 'UTC',
}));
