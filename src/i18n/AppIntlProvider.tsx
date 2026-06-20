'use client';

import { NextIntlClientProvider } from 'next-intl';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import englishMessages from '../../messages/en.json';
import russianMessages from '../../messages/ru.json';
import { defaultLocale, type Locale } from './config';

type LocaleContextValue = Readonly<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>;

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function AppIntlProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const messages = locale === 'ru' ? russianMessages : englishMessages;
  const contextValue = useMemo(() => ({ locale, setLocale }), [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useAppLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useAppLocale must be used within AppIntlProvider');
  }

  return context;
}
