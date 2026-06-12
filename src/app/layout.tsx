import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Swagger Editor App',
  description: 'Educational Swagger editor built with Next.js, React, and TypeScript.',
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
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <I18nProvider>
      <ToastProvider>{children}</ToastProvider>
    </I18nProvider>
  );
}

function I18nProvider({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}

function ToastProvider({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}

function Header() {
  return (
    <header>
      <span>Swagger UI</span>
    </header>
  );
}

function Footer() {
  return (
    <footer id="about">
      <span>RS School 2024</span>
    </footer>
  );
}
