import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BaseLayout } from '@components/BaseLayout/BaseLayout';
import englishMessages from '../../messages/en.json';
import { AppIntlProvider } from '@/i18n/AppIntlProvider';
import { defaultLocale } from '@/i18n/config';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import '@/styles/index.css';

export const metadata: Metadata = {
  title: englishMessages.Metadata.title,
  description: englishMessages.Metadata.description,
  icons: {
    icon: [
      { url: '/assets/app-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body>
        <AppIntlProvider>
          <ThemeRegistry>
            <BaseLayout>{children}</BaseLayout>
          </ThemeRegistry>
        </AppIntlProvider>
      </body>
    </html>
  );
}
