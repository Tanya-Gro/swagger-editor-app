import DataObjectOutlinedIcon from '@mui/icons-material/DataObjectOutlined';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { HeaderClient } from './HeaderClient';
import styles from './Header.module.css';

const cx = classNames.bind(styles);
const headerElementId = 'app-header';

export function Header() {
  return (
    <header className={cx('header')} id={headerElementId}>
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

          <HeaderClient headerElementId={headerElementId} />
        </div>
      </div>
    </header>
  );
}
