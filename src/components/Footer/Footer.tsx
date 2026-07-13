import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link } from '@mui/material';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';

const cx = classNames.bind(styles);

export function Footer() {
  const t = useTranslations('FOOTER');

  return (
    <footer className={cx('footer')}>
      <Link className={cx('about-link')} href="/about" underline="none">
        <InfoOutlinedIcon aria-hidden="true" className={cx('icon')} fontSize="inherit" />
        {t('about')}
      </Link>
      <Link
        className={cx('school')}
        href="https://rs.school/"
        rel="noopener noreferrer"
        target="_blank"
        underline="none"
      >
        RS School 2026
      </Link>
      <div className={cx('note')}>{t('madeBy')}</div>
    </footer>
  );
}
