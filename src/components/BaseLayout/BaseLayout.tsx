import type { ReactNode } from 'react';

import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';

import classNames from 'classnames/bind';
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
