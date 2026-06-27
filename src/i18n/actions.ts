'use server';

import { cookies } from 'next/headers';
import { isLocale, localeCookieName, type Locale } from './config';

export async function setLocale(locale: Locale): Promise<void> {
  if (!isLocale(locale)) {
    return;
  }

  const cookieStore = await cookies();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  cookieStore.set(localeCookieName, locale, {
    expires: expirationDate,
    httpOnly: false,
    path: '/',
    sameSite: 'lax',
  });
}
