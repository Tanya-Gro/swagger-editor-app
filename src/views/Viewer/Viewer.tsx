'use client';

import classNames from 'classnames/bind';

import { type Endpoint } from '@/types';
import { Card } from '@/components/Viewer/Card/Card';
import styles from './Viewer.module.css';

const cx = classNames.bind(styles);

type ViewerViewProps = {
  endpointList: Endpoint[];
};

export function ViewerView({ endpointList }: ViewerViewProps) {
  return (
    <section>
      <header className={cx('header')}>
        <h1 className={cx('title')}>Swagger UI</h1>
      </header>

      {endpointList.length > 0 && (
        <ul className={cx('list')}>
          {endpointList.map((endpoint) => (
            <li key={`${endpoint.method}-${endpoint.path}`}>
              <Card endpoint={endpoint} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
