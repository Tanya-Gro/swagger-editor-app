import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Swagger Editor App',
  description: 'Educational Swagger editor built with Next.js, React, and TypeScript.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
