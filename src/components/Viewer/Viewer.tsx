import classNames from 'classnames/bind';
import styles from './Viewer.module.css';

const cx = classNames.bind(styles);

export function Viewer() {
  return (
    <section className={cx('viewer')} aria-labelledby="viewer-heading">
      <header className={cx('header')}>
        <h2 className={cx('title')} id="viewer-heading">
          Swagger Viewer
        </h2>
        <p className={cx('subtitle')}>Sample API v1.0.0</p>
      </header>

      <div className={cx('placeholder')}>
        <div>Viewer placeholder</div>
      </div>
    </section>
  );
}
