import type { ReactNode } from 'react';

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <main id="main-content">{children}</main>;
}
