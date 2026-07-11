import exampleSchema from './exampleSchema.json';
import { getEndpoints } from '@/utils/viewer/getEndpoints';
import classNames from 'classnames/bind';
import { Card } from '@/components/Viewer/Card/Card';
import styles from './Viewer.module.css';

const cx = classNames.bind(styles);

export function Viewer() {
  const validSchema = JSON.stringify(exampleSchema);
  const endpointList = getEndpoints(validSchema);

  return (
    <section>
      <header className={cx('header')}>
        <h1 className={cx('title')}>Swagger UI</h1>
      </header>

      {endpointList.length > 0 && (
        <ul className={cx('list')}>
          {endpointList.map((endpoint) => (
            <li key={`${endpoint.method}-${endpoint.pathname}`}>
              <Card endpoint={endpoint} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
