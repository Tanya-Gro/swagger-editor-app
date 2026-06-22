import classNames from 'classnames/bind';
import styles from './Home.module.css';

const cx = classNames.bind(styles);

export function Home() {
  return (
    <div className={cx('main-layout')}>
      <div className={cx('panel')}>Editor placeholder</div>
      <div className={cx('panel')}>Viewer placeholder</div>
    </div>
  );
}
