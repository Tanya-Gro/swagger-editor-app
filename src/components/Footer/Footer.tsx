import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './Footer.module.css';

const cx = classNames.bind(styles);

export function Footer() {
  return (
    <footer className={cx('footer')}>
      <div className={cx('inner')}>
        <div className={cx('links')}>
          <Link className={cx('about-link')} href="/about" underline="none">
            <InfoOutlinedIcon aria-hidden="true" className={cx('icon')} fontSize="inherit" />О проекте
          </Link>
          <span aria-hidden="true" className={cx('separator')}>
            |
          </span>
          <span>RS School 2024</span>
        </div>
        <div className={cx('note')}>Made with ♥ by ATOM Team</div>
      </div>
    </footer>
  );
}
