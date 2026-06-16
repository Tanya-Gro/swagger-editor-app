import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { headerMessages } from './Header.i18n';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

const headerLogo = {
  name: 'Swagger UI',
  subtitle: 'API Documentation',
} as const;

const navigationAriaLabel = 'Основная навигация';

const navigationLinks = [
  { href: '/', label: 'О проекте' },
  { href: '/', label: 'Редактор' },
] as const;

export function Header() {
  return (
    <header className={cx('header')}>
      <div className={cx('inner')}>
        <Link aria-label={headerMessages.homeAriaLabel} className={cx('logo')} data-testid="header-logo" href="/">
          <span className={cx('logo-mark')}>
            <span aria-hidden="true" className={cx('logo-image')} />
          </span>
          <span className={cx('logo-text')}>
            <span className={cx('logo-title')}>{headerLogo.name}</span>
            <span className={cx('logo-subtitle')}>{headerLogo.subtitle}</span>
          </span>
        </Link>

        <nav aria-label={navigationAriaLabel} className={cx('nav')}>
          {navigationLinks.map(({ href, label }) => (
            <Link className={cx('nav-link')} href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className={cx('actions')}>
          <div className={cx('desktop-actions')}>
            <Button className={cx('button', 'ghost-button')} startIcon={<PublicOutlinedIcon />} variant="text">
              {headerMessages.language}
            </Button>
            <Button className={cx('button', 'primary-button')} startIcon={<LoginOutlinedIcon />} variant="contained">
              {headerMessages.authAction}
            </Button>
          </div>

          <details className={cx('mobile-menu-details')}>
            <summary aria-label={headerMessages.menuAriaLabel} className={cx('mobile-menu-button')}>
              <IconButton aria-hidden="true" className={cx('mobile-menu-icon')} component="span" size="medium">
                <MenuOutlinedIcon />
              </IconButton>
            </summary>
            <div className={cx('mobile-menu')} id="mobile-header-menu">
              <div className={cx('mobile-menu-section')} />
              <div className={cx('mobile-menu-section')}>
                <Button
                  className={cx('mobile-menu-action', 'button', 'ghost-button')}
                  startIcon={<PublicOutlinedIcon />}
                  variant="text"
                >
                  {headerMessages.language}
                </Button>
                <Button
                  className={cx('mobile-menu-action', 'button', 'primary-button')}
                  startIcon={<LoginOutlinedIcon />}
                  variant="contained"
                >
                  {headerMessages.authAction}
                </Button>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
