import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

type HeaderProperties = Readonly<{
  actionsSlot?: ReactNode;
  languageSwitcherSlot?: ReactNode;
  navigationSlot?: ReactNode;
}>;

export function Header({ actionsSlot, languageSwitcherSlot, navigationSlot }: HeaderProperties) {
  return (
    <header className={cx('header')}>
      <div className={cx('container')}>
        <div className={cx('inner')}>
          <Link aria-label="Swagger UI home" className={cx('logo')} href="/">
            <span className={cx('logo-mark')}>
              <DataObjectOutlinedIcon fontSize="medium" />
            </span>
            <span className={cx('logo-text')}>
              <span className={cx('logo-title')}>Swagger UI</span>
              <span className={cx('logo-subtitle')}>API Documentation</span>
            </span>
          </Link>

          <nav aria-label="Основная навигация" className={cx('nav')}>
            {navigationSlot ?? <NavigationPlaceholder />}
          </nav>

          <div className={cx('actions')}>
            <div className={cx('desktop-actions')}>
              {languageSwitcherSlot ?? <LanguageSwitcherPlaceholder />}
              {actionsSlot ?? <ActionsPlaceholder />}
            </div>

            <details className={cx('mobile-menu-details')}>
              <summary aria-label="Открыть меню" className={cx('mobile-menu-button')}>
                <IconButton aria-hidden="true" component="span" size="medium">
                  <MenuOutlinedIcon />
                </IconButton>
              </summary>
              <div className={cx('mobile-menu')} id="mobile-header-menu">
                <nav aria-label="Мобильная навигация" className={cx('mobile-menu-section')}>
                  {navigationSlot ?? <NavigationPlaceholder />}
                </nav>
                <div className={cx('mobile-menu-section')}>
                  {languageSwitcherSlot ?? <LanguageSwitcherPlaceholder />}
                  {actionsSlot ?? <ActionsPlaceholder />}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavigationPlaceholder() {
  return (
    <>
      <Link className={cx('nav-link')} href="/">
        Редактор
      </Link>
      <a className={cx('nav-link')} href="#about">
        О проекте
      </a>
    </>
  );
}

function LanguageSwitcherPlaceholder() {
  return (
    <Button className={cx('button', 'ghost-button')} startIcon={<PublicOutlinedIcon />} variant="text">
      RU
    </Button>
  );
}

function ActionsPlaceholder() {
  return (
    <>
      <Button className={cx('button', 'ghost-button')} startIcon={<LoginOutlinedIcon />} variant="text">
        Вход
      </Button>
      <Button className={cx('button', 'primary-button')} startIcon={<PersonAddAltOutlinedIcon />} variant="contained">
        Регистрация
      </Button>
    </>
  );
}
