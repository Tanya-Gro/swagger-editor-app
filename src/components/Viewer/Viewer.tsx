import styles from './Viewer.module.css';
import classNames from 'classnames/bind';
import { Card } from './Card/Card';

const cx = classNames.bind(styles);

export function Viewer() {
  return (
    <section>
      <header className={cx('header')}>
        <h1 className={cx('title')}>Swagger UI</h1>
      </header>
      <ul className={cx('list')}>
        <li>
          <Card />
        </li>
      </ul>
    </section>
  );
}
