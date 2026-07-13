'use client';

import classNames from 'classnames/bind';
import styles from './Responses.module.css';
import { useTranslations } from 'next-intl';

const cx = classNames.bind(styles);

type ResponsesProps = {
  responses: Record<string, unknown> | undefined;
};

export function Responses({ responses }: ResponsesProps) {
  const t = useTranslations('VIEWER');

  return (
    <section>
      {responses && Object.keys(responses).length > 0 && (
        <>
          <h2 className={cx('title')}>{t('response')}</h2>
          <ul className={cx('list')}>
            {Object.entries(responses).map(([status, response]) => {
              return (
                <li key={status} className={cx('list-item')}>
                  <pre className={cx('code-block')}>
                    <code>{JSON.stringify({ status, response }, null, 2)}</code>
                  </pre>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
