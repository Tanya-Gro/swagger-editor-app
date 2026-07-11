import styles from './Viewer.module.css';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { Card } from './Card/Card';

const cx = classNames.bind(styles);

export function Viewer() {
  const t = useTranslations('VIEWER');

  return (
    <section>
      <header className={cx('header')}>
        <h1 className={cx('title')}>{t('title')}</h1>
      </header>
      <ul className={cx('list')}>
        <li>
          <Card />
        </li>
      </ul>
    </section>
  );
}
