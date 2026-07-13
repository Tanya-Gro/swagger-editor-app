import { LoginOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';

import { LanguageSwitcher } from '@/components/Header/LanguageSwitcher/LanguageSwitcher';
import { Burger } from '@/components/Header/Burger/Burger';
import styles from './Header.module.css';
import { navigationLinks } from '@/components/Header/navigationLinks';
import { getLocale, getTranslations } from 'next-intl/server';
import { type LogoutAction } from '@/types';
import { Logout } from '@/components/Logout/Logout';

const cx = classNames.bind(styles);

type HeaderViewProps = {
  isAuthenticated: boolean;
  logoutAction: LogoutAction;
};

export async function HeaderView({ isAuthenticated, logoutAction }: HeaderViewProps) {
  const t = await getTranslations('HEADER');
  const locale = await getLocale();

  return (
    <header className={cx('header')}>
      <div className={cx('inner')}>
        <Link aria-label={t('homeAriaLabel')} className={cx('logo')} data-testid="header-logo" href="/">
          <span className={cx('logo-mark')}>
            <span aria-hidden="true" className={cx('logo-image')} />
          </span>
          <span className={cx('logo-text')}>
            <span className={cx('logo-title')}>{t('brandName')}</span>
            <span className={cx('logo-subtitle')}>{t('brandSubtitle')}</span>
          </span>
        </Link>

        <nav aria-label={t('navigationAriaLabel')} className={cx('nav')}>
          {navigationLinks.map(({ href, messageKey }) => (
            <Link className={cx('nav-link')} href={href} key={href}>
              {t(messageKey)}
            </Link>
          ))}
          {isAuthenticated && (
            <Link className={cx('nav-link')} href="/history">
              {t('history')}
            </Link>
          )}
        </nav>

        <div className={cx('actions')}>
          <div className={cx('desktop-actions')}>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <Logout action={logoutAction} label={t('signoutAction')} />
            ) : (
              <Link href="/login">
                <Button component="span" startIcon={<LoginOutlined />} variant="contained">
                  {t('authAction')}
                </Button>
              </Link>
            )}
          </div>
          <Burger
            key={`${locale}-${isAuthenticated ? 'authenticated' : 'anonymous'}`}
            isAuthenticated={isAuthenticated}
            logoutAction={logoutAction}
          />
        </div>
      </div>
    </header>
  );
}
