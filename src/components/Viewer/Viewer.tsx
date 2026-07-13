'use client';

import { getEndpoints } from '@/utils/viewer/getEndpoints';
import classNames from 'classnames/bind';
import { Card } from '@/components/Viewer/Card/Card';
import styles from './Viewer.module.css';
import { useEditorStore } from '@/store/useEditorStore';
import { useTranslations } from 'next-intl';

const cx = classNames.bind(styles);

export function Viewer() {
  const validSchema = useEditorStore((state) => state.validSchema);
  const endpointList = getEndpoints(validSchema);
  const t = useTranslations('VIEWER');

  return (
    <section>
      <header className={cx('header')}>
        <h1 className={cx('title')}>Swagger UI</h1>
      </header>

      {endpointList.length > 0 ? (
        <ul className={cx('list')}>
          {endpointList.map((endpoint) => (
            <li key={`${endpoint.method}-${endpoint.pathname}`}>
              <Card endpoint={endpoint} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={cx('empty')}>
          <p>{t('emptyMessage')}</p>
        </div>
      )}
    </section>
  );
}
