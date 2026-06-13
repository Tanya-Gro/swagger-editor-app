import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import { Button, IconButton } from '@mui/material';
import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './Header.module.css';

const cx = classNames.bind(styles);

export function Header() {
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
            <Link className={cx('nav-link')} href="/">
              Редактор
            </Link>
            <a className={cx('nav-link')} href="#about">
              О проекте
            </a>
          </nav>

          <div className={cx('actions')}>
            <div className={cx('desktop-actions')}>
              <Button className={cx('button', 'ghost-button')} startIcon={<PublicOutlinedIcon />} variant="text">
                RU
              </Button>
              <Button className={cx('button', 'ghost-button')} startIcon={<LoginOutlinedIcon />} variant="text">
                Вход
              </Button>
              <Button
                className={cx('button', 'primary-button')}
                startIcon={<PersonAddAltOutlinedIcon />}
                variant="contained"
              >
                Регистрация
              </Button>
            </div>

            <IconButton aria-label="Открыть меню" className={cx('mobile-menu-button')} size="medium">
              <MenuOutlinedIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  );
}
