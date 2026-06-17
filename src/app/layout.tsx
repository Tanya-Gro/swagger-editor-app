import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { BaseLayout } from '@components/BaseLayout/BaseLayout';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import '@/styles/index.css';

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
        <ThemeRegistry>
          <BaseLayout>{children}</BaseLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
