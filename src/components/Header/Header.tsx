import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

const navigationLinks = [
  { href: '/about', messageKey: 'about' },
  { href: '/', messageKey: 'editor' },
] as const;

export function Header() {
  const t = useTranslations('HEADER');

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
        </nav>

        <div className={cx('actions')}>
          <div className={cx('desktop-actions')}>
            <LanguageSwitcher />
            <Button className={cx('auth-action')} startIcon={<LoginOutlinedIcon />} variant="contained"></Button>
            <Link href="/login">
              <Button component="span" startIcon={<LoginOutlinedIcon />} variant="contained">
                {t('authAction')}
              </Button>
            </Link>
          </div>

          <details className={cx('mobile-menu-details')}>
            <summary aria-label={t('menuAriaLabel')} className={cx('mobile-menu-button')}>
              <IconButton aria-hidden="true" className={cx('mobile-menu-icon')} component="span" size="medium">
                <MenuOutlinedIcon />
              </IconButton>
            </summary>
            <div className={cx('mobile-menu')} id="mobile-header-menu">
              <div className={cx('mobile-menu-section')} />
              <div className={cx('mobile-menu-section')}>
                <LanguageSwitcher className={cx('mobile-menu-action')} />
                <Link href="/login">
                  <Button
                    component="span"
                    className={cx('mobile-menu-action')}
                    startIcon={<LoginOutlinedIcon />}
                    variant="contained"
                  >
                    {t('authAction')}
                  </Button>
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
