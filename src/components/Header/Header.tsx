'use client';

import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

type MobileMenuProperties = Readonly<{
  isOpen: boolean;
}>;

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateHeaderShadow = () => {
      setIsScrolled(window.scrollY > 0);
    };

    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateHeaderShadow);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((currentValue) => !currentValue);
  };

  return (
    <header className={cx('header', { 'header-scrolled': isScrolled })}>
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
            <Link className={cx('nav-link')} href="/">
              Редактор
            </Link>
            <a className={cx('nav-link')} href="#about">
              О проекте
            </a>
          </nav>

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
        </div>

        <MobileMenu isOpen={isMobileMenuOpen} />
      </div>
    </header>
  );
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
