import type { ReactNode } from 'react';
import styles from './BaseLayout.module.css';

export function BaseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className={styles.main} id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}

function Header() {
  return <header />;
}

function Footer() {
  return <footer />;
}
