'use client';

import { Button, Chip } from '@mui/material';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { formatBytes } from '@/utils/history/formatBytes';
import { formatTimestamp } from '@/utils/history/formatTimestamp';
import type { RequestHistoryItem } from '../types';

import classNames from 'classnames/bind';
import styles from './HistoryDetails.module.css';

const cx = classNames.bind(styles);

type HistoryDetailsProperties = Readonly<{
  entry: RequestHistoryItem;
}>;

function formatStatus(statusCode: number | null): string {
  return statusCode === null ? '-' : String(statusCode);
}

export function HistoryDetails({ entry }: HistoryDetailsProperties) {
  const locale = useLocale();
  const t = useTranslations('HISTORY');

  return (
    <div className={cx('page')}>
      <div className={cx('inner')}>
        <header className={cx('header')}>
          <h1 className={cx('title')}>{t('detailTitle')}</h1>
          <p className={cx('description')}>
            {entry.method} {entry.endpoint}
          </p>
        </header>

        <section aria-label={t('detailTitle')} className={cx('note')}>
          <dl className={cx('detail-list')}>
            <div>
              <dt>{t('method')}</dt>
              <dd>{entry.method}</dd>
            </div>
            <div>
              <dt>{t('url')}</dt>
              <dd>
                <code className={cx('code')}>{entry.endpoint}</code>
              </dd>
            </div>
            <div>
              <dt>{t('status')}</dt>
              <dd>
                <Chip label={formatStatus(entry.statusCode)} size="small" />
              </dd>
            </div>
            <div>
              <dt>{t('time')}</dt>
              <dd>{entry.duration} ms</dd>
            </div>
            <div>
              <dt>{t('request')}</dt>
              <dd>{formatBytes(entry.requestSize)}</dd>
            </div>
            <div>
              <dt>{t('response')}</dt>
              <dd>{formatBytes(entry.responseSize)}</dd>
            </div>
            <div>
              <dt>{t('timestamp')}</dt>
              <dd>{formatTimestamp(entry.timestamp, locale)}</dd>
            </div>
            <div>
              <dt>{t('error')}</dt>
              <dd className={cx('detail-value', { muted: !entry.errorDetails })}>{entry.errorDetails ?? '-'}</dd>
            </div>
          </dl>
          <div className={cx('empty-actions')}>
            <Button component={Link} href="/history" variant="outlined">
              {t('backToHistory')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
