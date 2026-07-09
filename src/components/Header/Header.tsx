import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Button } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

const navigationLinks = [
  { href: '/about', messageKey: 'about' },
  { href: '/', messageKey: 'editor' },
  { href: '/history', messageKey: 'history' },
] as const;

export function Header() {
  const t = useTranslations('HEADER');
  const renderNavigationItems = () =>
    navigationLinks.map(({ href, messageKey }) => (
      <Link className={cx('nav-link')} href={href} key={href}>
        {t(messageKey)}
      </Link>
    ));

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
          {renderNavigationItems()}
        </nav>

        <div className={cx('actions')}>
          <div className={cx('desktop-actions')}>
            <LanguageSwitcher />
            <Link href="/login">
              <Button component="span" startIcon={<LoginOutlinedIcon />} variant="contained">
                {t('authAction')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <details className={cx('mobile-menu-details')}>
        <summary aria-label={t('menuAriaLabel')} className={cx('mobile-menu-button')}>
          <span aria-hidden="true" className={cx('mobile-menu-icon')}>
            <MenuOutlinedIcon />
          </span>
        </summary>
        <div className={cx('mobile-menu')} id="mobile-header-menu">
          <div className={cx('mobile-menu-section')}>{renderNavigationItems()}</div>
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
    </header>
  );
}
