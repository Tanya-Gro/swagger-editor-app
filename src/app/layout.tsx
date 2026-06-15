import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BaseLayout } from '@components/BaseLayout/BaseLayout';
import '../styles/index.css';

export const metadata: Metadata = {
  title: 'Swagger Editor App',
  description: 'Educational Swagger editor built with Next.js, React, and TypeScript.',
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
    <html lang="en">
      <body>
        <Providers>
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
}

function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <AppRouterCacheProvider>
      <I18nProvider>
        <ToastProvider>{children}</ToastProvider>
      </I18nProvider>
    </AppRouterCacheProvider>
  );
}

function I18nProvider({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}

function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
