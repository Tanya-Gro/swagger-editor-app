'use client';

import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

type HeaderClientProperties = Readonly<{
  headerElementId: string;
}>;

type MobileMenuProperties = Readonly<{
  isOpen: boolean;
}>;

export function HeaderClient({ headerElementId }: HeaderClientProperties) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useHeaderShadow(headerElementId);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((currentValue) => !currentValue);
  };

  return (
    <>
      <div className={cx('actions')}>
        <DesktopActions />

        <IconButton
          aria-controls="mobile-header-menu"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          className={cx('mobile-menu-button')}
          onClick={toggleMobileMenu}
          size="medium"
        >
          <MenuOutlinedIcon />
        </IconButton>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} />
    </>
  );
}

function useHeaderShadow(headerElementId: string) {
  useEffect(() => {
    const headerElement = document.querySelector(`#${headerElementId}`);

    if (!headerElement) {
      return undefined;
    }

    const updateHeaderShadow = () => {
      headerElement.classList.toggle(styles['header-scrolled'], window.scrollY > 0);
    };

    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderShadow);
    };
  }, [headerElementId]);
}

function DesktopActions() {
  return (
    <div className={cx('desktop-actions')}>
      <Button className={cx('button', 'ghost-button')} startIcon={<PublicOutlinedIcon />} variant="text">
        RU
      </Button>
      <Button className={cx('button', 'ghost-button')} startIcon={<LoginOutlinedIcon />} variant="text">
        Вход
      </Button>
      <Button className={cx('button', 'primary-button')} startIcon={<PersonAddAltOutlinedIcon />} variant="contained">
        Регистрация
      </Button>
    </div>
  );
}

function MobileMenu({ isOpen }: MobileMenuProperties) {
  return (
    <div aria-hidden={!isOpen} className={cx('mobile-menu', { 'mobile-menu-open': isOpen })} id="mobile-header-menu">
      <Button className={cx('mobile-menu-item')} startIcon={<PublicOutlinedIcon />} variant="text">
        RU
      </Button>
      <Button className={cx('mobile-menu-item')} startIcon={<LoginOutlinedIcon />} variant="text">
        Вход
      </Button>
      <Button
        className={cx('mobile-menu-item', 'mobile-menu-primary')}
        startIcon={<PersonAddAltOutlinedIcon />}
        variant="contained"
      >
        Регистрация
      </Button>
    </div>
  );
}
