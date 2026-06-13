import classNames from 'classnames/bind';
import type { ReactNode } from 'react';
import styles from './BaseLayout.module.css';

const cx = classNames.bind(styles);

export function BaseLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className={cx('main')} id="main-content">
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
