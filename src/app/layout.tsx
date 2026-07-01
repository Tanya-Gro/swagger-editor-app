import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { BaseLayout } from '@/components/BaseLayout/BaseLayout';
import '@/styles/index.css';
import Providers from './providers';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('METADATA');

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        { url: '/assets/app-logo.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
          <Providers>
            <BaseLayout>{children}</BaseLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
