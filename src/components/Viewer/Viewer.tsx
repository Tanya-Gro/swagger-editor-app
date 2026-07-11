'use client';

import styles from './Viewer.module.css';
import classNames from 'classnames/bind';
import { Card } from './Card/Card';
import exampleSchema from './exampleSchema.json';
import { getEndpoints } from '@/utils/viewer/getEndpoints';

const cx = classNames.bind(styles);

export async function Viewer() {
  const validSchema = JSON.stringify(exampleSchema);
  const endpointList = await getEndpoints(validSchema);

  return (
    <section>
      <header className={cx('header')}>
        <h1 className={cx('title')}>Swagger UI</h1>
      </header>
      {endpointList.length > 0 && (
        <ul className={cx('list')}>
          {endpointList.map((endpoint) => (
            <li key={`${endpoint.method}-${endpoint.path}`}>
              <Card
                path={endpoint.path}
                method={endpoint.method}
                summary={endpoint.summary}
                parameters={endpoint.parameters}
                responses={endpoint.responses}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
