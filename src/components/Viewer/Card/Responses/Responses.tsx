'use client';

import classNames from 'classnames/bind';
import styles from './Responses.module.css';
import { useTranslations } from 'next-intl';
import { getEndpointKey, useViewerStore } from '@/store/useViewerStore';
import type { HttpMethod } from '@/types';

const cx = classNames.bind(styles);

type ResponsesProps = {
  responses: Record<string, unknown> | undefined;
  method: HttpMethod;
  pathname: string;
};

function safelyParseBody(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

export function Responses({ responses, method, pathname }: ResponsesProps) {
  const t = useTranslations('VIEWER');
  const key = getEndpointKey(method, pathname);
  const executeResult = useViewerStore((state) => state.executeResults[key] ?? null);

  return (
    <section>
      {executeResult && (
        <div className={cx('execute-result-wrapper')} style={{ marginBottom: '24px' }}>
          <h2 className={cx('title')} style={{ color: 'var(--mui-palette-success-main)' }}>
            {t('executeResponseTitle')}
          </h2>

          <div className={cx('metrics-badge')} style={{ fontSize: '12px', margin: '8px 0', color: 'gray' }}>
            {t('requestTimeLabel')}: {executeResult.metrics.durationMs} ms | {t('formedAtLabel')}:{' '}
            {new Date(executeResult.metrics.requestTimeIso).toLocaleTimeString()}
          </div>

          <pre className={cx('code-block')} style={{ border: '1px solid green', background: '#f4fbf4' }}>
            <code>
              {JSON.stringify(
                {
                  status: executeResult.status,
                  statusText: executeResult.statusText,
                  headers: executeResult.headers,
                  body: safelyParseBody(executeResult.body),
                },
                null,
                2,
              )}
            </code>
          </pre>
        </div>
      )}

      {responses && Object.keys(responses).length > 0 && (
        <>
          <h2 className={cx('title')}>{t('response')}</h2>
          <ul className={cx('list')}>
            {Object.entries(responses).map(([status, response]) => (
              <li key={status} className={cx('list-item')}>
                <pre className={cx('code-block')}>
                  <code>{JSON.stringify({ status, response }, null, 2)}</code>
                </pre>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
