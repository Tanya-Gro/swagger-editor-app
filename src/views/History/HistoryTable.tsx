'use client';

import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { HistoryMethod, HistoryStatusTone, RequestHistoryItem } from './types';
import styles from './History.module.css';

const methodColors: Record<HistoryMethod, 'primary' | 'error'> = {
  GET: 'primary',
  POST: 'primary',
  PUT: 'primary',
  DELETE: 'error',
};

const methodClasses: Record<HistoryMethod, string> = {
  GET: 'method-get',
  POST: 'method-post',
  PUT: 'method-put',
  DELETE: 'method-delete',
};

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

function getStatusTone(statusCode: number): HistoryStatusTone {
  if (statusCode >= SERVER_ERROR_STATUS_CODE) {
    return 'danger';
  }

  if (statusCode >= CLIENT_ERROR_STATUS_CODE) {
    return 'warning';
  }

  return 'success';
}

function formatBytes(bytes: number): string {
  const kilobyte = 1024;

  if (bytes === 0) {
    return '0 B';
  }

  if (bytes < kilobyte) {
    return `${String(bytes)} B`;
  }

  return `${(bytes / kilobyte).toFixed(1)} KB`;
}

export default function HistoryTable({ entries }: HistoryTableProps) {
  const t = useTranslations('HISTORY');

  return (
    <section aria-label={t('tableAriaLabel')} className={styles['table-card']}>
      <div className={styles['table-wrap']}>
        <Table className={styles.table}>
          <TableHead className={styles['table-head']}>
            <TableRow className={styles['table-row']}>
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
          <TableBody className={styles['table-body']}>
            {entries.map((entry) => (
              <TableRow className={styles['table-row']} key={entry.id}>
                <TableCell className={styles['table-cell']} data-label={t('method')}>
                  <Chip
                    className={methodClasses[entry.method]}
                    color={methodColors[entry.method]}
                    label={entry.method}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell className={styles['table-cell']} data-label={t('url')}>
                  <code className={styles.code}>{entry.endpoint}</code>
                </TableCell>
                <TableCell className={styles['table-cell']} data-label={t('status')}>
                  <Chip
                    color={statusColors[getStatusTone(entry.statusCode)]}
                    label={String(entry.statusCode)}
                    size="small"
                  />
                </TableCell>
                <TableCell className={styles['table-cell']} data-label={t('time')}>
                  {entry.duration} ms
                </TableCell>
                <TableCell className={styles['table-cell']} data-label={t('request')}>
                  {formatBytes(entry.requestSize)}
                </TableCell>
                <TableCell className={styles['table-cell']} data-label={t('response')}>
                  {formatBytes(entry.responseSize)}
                </TableCell>
                <TableCell className={styles['table-cell']} data-label={t('timestamp')}>
                  {entry.timestamp}
                </TableCell>
                <TableCell
                  className={entry.errorDetails ? styles['table-cell'] : `${styles['table-cell']} ${styles.muted}`}
                  data-label={t('error')}
                >
                  {entry.errorDetails ?? '-'}
                </TableCell>
                <TableCell className={styles['table-cell']} data-label={t('analytics')}>
                  <Link className={styles['analytics-link']} href={`/history/${entry.id}`}>
                    {t('details')}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
