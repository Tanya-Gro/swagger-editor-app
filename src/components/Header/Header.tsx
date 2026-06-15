import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import buttonStyles from '../../styles/button.module.css';
import { headerMessages } from './Header.i18n';
import styles from './Header.module.css';

const cx = classNames.bind(styles);
const buttonCx = classNames.bind(buttonStyles);

export function Header() {
  return (
    <header className={cx('header')}>
      <div className={cx('inner')}>
        <Link aria-label={headerMessages.homeAriaLabel} className={cx('logo')} data-testid="header-logo" href="/">
          <span className={cx('logo-mark')}>
            <span aria-hidden="true" className={cx('logo-image')} />
          </span>
          <span className={cx('logo-text')}>
            <span className={cx('logo-title')}>{headerMessages.appName}</span>
            <span className={cx('logo-subtitle')}>{headerMessages.appSubtitle}</span>
          </span>
        </Link>

        <div className={cx('nav')} />

        <div className={cx('actions')}>
          <div className={cx('desktop-actions')}>
            <Button className={buttonCx('button', 'ghost')} startIcon={<PublicOutlinedIcon />} variant="text">
              {headerMessages.language}
            </Button>
            <Button className={buttonCx('button', 'primary')} startIcon={<LoginOutlinedIcon />} variant="contained">
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
                  className={cx('mobile-menu-action', buttonCx('button', 'ghost'))}
                  startIcon={<PublicOutlinedIcon />}
                  variant="text"
                >
                  {headerMessages.language}
                </Button>
                <Button
                  className={cx('mobile-menu-action', buttonCx('button', 'primary'))}
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
