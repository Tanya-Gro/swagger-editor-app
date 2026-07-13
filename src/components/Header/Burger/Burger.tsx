'use client';

import { useState, type SyntheticEvent } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/Header/LanguageSwitcher/LanguageSwitcher';

import { LoginOutlined, MenuOutlined } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';

import styles from './Burger.module.css';
import { navigationLinks } from '../navigationLinks';

import classNames from 'classnames/bind';
import type { LogoutAction } from '@/types';
import { Logout } from '@/components/Logout/Logout';

const cx = classNames.bind(styles);

type BurgerProps = {
  isAuthenticated: boolean;
  logoutAction: LogoutAction;
};

export function Burger({ isAuthenticated, logoutAction }: BurgerProps) {
  const t = useTranslations('HEADER');
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  const handleToggle = (e: SyntheticEvent<HTMLDetailsElement>) => {
    setIsOpen(e.currentTarget.open);
  };
  const handleSummaryClick = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <details className={cx('mobile-menu-details')} open={isOpen} onToggle={handleToggle}>
      <summary aria-label={t('menuAriaLabel')} className={cx('mobile-menu-button')} onClick={handleSummaryClick}>
        <IconButton
          className={cx('mobile-menu-icon')}
          component="span"
          size="medium"
          aria-controls="mobile-header-menu"
        >
          <MenuOutlined />
        </IconButton>
      </summary>
      <div className={cx('mobile-menu')} id="mobile-header-menu">
        <div className={cx('mobile-menu-section')}>
          {navigationLinks.map(({ href, messageKey }) => (
            <Link className={cx('nav-link')} href={href} key={href} onClick={closeMenu}>
              {t(messageKey)}
            </Link>
          ))}
          {isAuthenticated && (
            <Link className={cx('nav-link')} href="/history" onClick={closeMenu}>
              {t('history')}
            </Link>
          )}
        </div>
        <div className={cx('mobile-menu-section')}>
          <LanguageSwitcher className={cx('mobile-menu-action')} />

          {isAuthenticated ? (
            <Logout action={logoutAction} className={cx('mobile-menu-action')} label={t('signoutAction')} />
          ) : (
            <Link href="/login">
              <Button
                component="span"
                className={cx('mobile-menu-action')}
                startIcon={<LoginOutlined />}
                variant="contained"
                onClick={closeMenu}
              >
                {t('authAction')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </details>
  );
}
