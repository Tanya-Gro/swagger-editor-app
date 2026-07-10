import { LogoutOutlined, LoginOutlined, MenuOutlined } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Header.module.css';
import { serverClient } from '@/database/server-client';
import { logoutAction } from './logout-action';

const cx = classNames.bind(styles);

const navigationLinks = [
  { href: '/about', messageKey: 'about' },
  { href: '/', messageKey: 'editor' },
] as const;

export async function Header() {
  const t = await getTranslations('HEADER');

  const supabase = await serverClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = user !== null;

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
              <form action={logoutAction}>
                <Button startIcon={<LogoutOutlined />} variant="contained" type="submit">
                  {t('signoutAction')}
                </Button>
              </form>
            ) : (
              <Link href="/login">
                <Button component="span" startIcon={<LoginOutlined />} variant="contained">
                  {t('authAction')}
                </Button>
              </Link>
            )}
          </div>

          <details className={cx('mobile-menu-details')}>
            <summary aria-label={t('menuAriaLabel')} className={cx('mobile-menu-button')}>
              <IconButton aria-hidden="true" className={cx('mobile-menu-icon')} component="span" size="medium">
                <MenuOutlined />
              </IconButton>
            </summary>
            <div className={cx('mobile-menu')} id="mobile-header-menu">
              <div className={cx('mobile-menu-section')} />
              <div className={cx('mobile-menu-section')}>
                <LanguageSwitcher className={cx('mobile-menu-action')} />

                {isAuthenticated ? (
                  <form action={logoutAction}>
                    <Button
                      className={cx('mobile-menu-action')}
                      startIcon={<LogoutOutlined />}
                      variant="contained"
                      type="submit"
                    >
                      {t('signoutAction')}
                    </Button>
                  </form>
                ) : (
                  <Link href="/login">
                    <Button
                      component="span"
                      className={cx('mobile-menu-action')}
                      startIcon={<LoginOutlined />}
                      variant="contained"
                    >
                      {t('authAction')}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
