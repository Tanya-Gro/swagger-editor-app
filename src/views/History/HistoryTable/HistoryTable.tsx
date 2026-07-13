'use client';

import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { formatBytes } from '@/utils/history/formatBytes';
import { formatTimestamp } from '@/utils/history/formatTimestamp';
import type { HistoryStatusTone, RequestHistoryItem } from '../types';

import classNames from 'classnames/bind';
import styles from './HistoryTable.module.css';

const cx = classNames.bind(styles);

const statusColors: Record<HistoryStatusTone, 'success' | 'warning' | 'error'> = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

const SERVER_ERROR_STATUS_CODE = 500;
const CLIENT_ERROR_STATUS_CODE = 400;

type HistoryTableProps = {
  entries: RequestHistoryItem[];
};

type HistoryTableContentProps = HistoryTableProps & {
  locale: string;
  t: (key: string) => string;
};

type HistoryEntryProps = {
  entry: RequestHistoryItem;
  locale: string;
  t: (key: string) => string;
};

function getMethodColor(method: string): 'primary' | 'info' | 'success' | 'warning' | 'error' {
  switch (method) {
    case 'GET': {
      return 'info';
    }

    case 'POST': {
      return 'success';
    }

    case 'PUT':
    case 'PATCH': {
      return 'warning';
    }

    case 'DELETE': {
      return 'error';
    }

    default: {
      return 'primary';
    }
  }
}

function getMethodClass(method: string): string | undefined {
  const normalizedMethod = method.toLowerCase();

  return ['get', 'post', 'put', 'delete'].includes(normalizedMethod) ? `method-${normalizedMethod}` : undefined;
}

function getStatusTone(statusCode: number | null): HistoryStatusTone | undefined {
  if (statusCode === null) {
    return undefined;
  }

  if (statusCode >= SERVER_ERROR_STATUS_CODE) {
    return 'danger';
  }

  if (statusCode >= CLIENT_ERROR_STATUS_CODE) {
    return 'warning';
  }

  return 'success';
}

function formatStatus(statusCode: number | null): string {
  return statusCode === null ? '-' : String(statusCode);
}

function getStatusColor(statusCode: number | null): 'success' | 'warning' | 'error' | undefined {
  const tone = getStatusTone(statusCode);

  return tone ? statusColors[tone] : undefined;
}

export function MethodChip({ method }: { method: string }) {
  return (
    <Chip
      className={getMethodClass(method)}
      color={getMethodColor(method)}
      label={method}
      size="small"
      variant="outlined"
    />
  );
}

function StatusChip({ statusCode }: { statusCode: number | null }) {
  return <Chip color={getStatusColor(statusCode)} label={formatStatus(statusCode)} size="small" />;
}

function DesktopHistoryRow({ entry, locale, t }: HistoryEntryProps) {
  return (
    <TableRow className={cx('table-row')}>
      <TableCell className={cx('table-cell')} data-label={t('method')}>
        <MethodChip method={entry.method} />
      </TableCell>
      <TableCell className={cx('table-cell')} data-label={t('url')}>
        <code className={cx('code')}>{entry.endpoint}</code>
      </TableCell>
      <TableCell className={cx('table-cell')} data-label={t('status')}>
        <StatusChip statusCode={entry.statusCode} />
      </TableCell>
      <TableCell className={cx('table-cell')} data-label={t('time')}>
        {entry.duration} ms
      </TableCell>
      <TableCell className={cx('table-cell')} data-label={t('request')}>
        {formatBytes(entry.requestSize)}
      </TableCell>
      <TableCell className={cx('table-cell')} data-label={t('response')}>
        {formatBytes(entry.responseSize)}
      </TableCell>
      <TableCell className={cx('table-cell')} data-label={t('timestamp')}>
        {formatTimestamp(entry.timestamp, locale)}
      </TableCell>
      <TableCell className={cx('table-cell', { muted: !entry.errorDetails })} data-label={t('error')}>
        {entry.errorDetails ?? '-'}
      </TableCell>
      <TableCell className={cx('table-cell')} data-label={t('analytics')}>
        <Link className={cx('analytics-link')} href={`/history/${entry.id}`}>
          {t('details')}
        </Link>
      </TableCell>
    </TableRow>
  );
}

function DesktopHistoryTable({ entries, locale, t }: HistoryTableContentProps) {
  return (
    <div className={cx('table-wrap')}>
      <Table className={cx('table')}>
        <TableHead className={cx('table-head')}>
          <TableRow className={cx('table-row')}>
            <TableCell>{t('method')}</TableCell>
            <TableCell>{t('url')}</TableCell>
            <TableCell>{t('status')}</TableCell>
            <TableCell>{t('time')}</TableCell>
            <TableCell>{t('request')}</TableCell>
            <TableCell>{t('response')}</TableCell>
            <TableCell>{t('timestamp')}</TableCell>
            <TableCell>{t('error')}</TableCell>
            <TableCell>{t('analytics')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className={cx('table-body')}>
          {entries.map((entry) => (
            <DesktopHistoryRow entry={entry} key={entry.id} locale={locale} t={t} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function MobileHistoryCard({ entry, locale, t }: HistoryEntryProps) {
  return (
    <li className={cx('mobile-card')}>
      <div className={cx('mobile-card-header')}>
        <div className={cx('mobile-card-title')}>
          <MethodChip method={entry.method} />
          <code className={cx('code')}>{entry.endpoint}</code>
        </div>
        <StatusChip statusCode={entry.statusCode} />
      </div>

      <dl className={cx('mobile-card-details')}>
        <div className={cx('mobile-card-row')}>
          <dt>{t('time')}</dt>
          <dd>{entry.duration} ms</dd>
        </div>
        <div className={cx('mobile-card-row')}>
          <dt>{t('request')}</dt>
          <dd>{formatBytes(entry.requestSize)}</dd>
        </div>
        <div className={cx('mobile-card-row')}>
          <dt>{t('response')}</dt>
          <dd>{formatBytes(entry.responseSize)}</dd>
        </div>
        <div className={cx('mobile-card-row')}>
          <dt>{t('timestamp')}</dt>
          <dd>{formatTimestamp(entry.timestamp, locale)}</dd>
        </div>
        <div className={cx('mobile-card-row')}>
          <dt>{t('error')}</dt>
          <dd className={entry.errorDetails ? undefined : cx('muted')}>{entry.errorDetails ?? '-'}</dd>
        </div>
      </dl>

      <Link className={cx('analytics-link')} href={`/history/${entry.id}`}>
        {t('details')}
      </Link>
    </li>
  );
}

function MobileHistoryList({ entries, locale, t }: HistoryTableContentProps) {
  return (
    <ul className={cx('mobile-list')}>
      {entries.map((entry) => (
        <MobileHistoryCard entry={entry} key={entry.id} locale={locale} t={t} />
      ))}
    </ul>
  );
}

export default function HistoryTable({ entries }: HistoryTableProps) {
  const locale = useLocale();
  const t = useTranslations('HISTORY');

  return (
    <section aria-label={t('tableAriaLabel')} className={cx('table-card')}>
      <DesktopHistoryTable entries={entries} locale={locale} t={t} />
      <MobileHistoryList entries={entries} locale={locale} t={t} />
    </section>
  );
}
