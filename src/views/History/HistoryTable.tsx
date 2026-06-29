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
        <Table sx={{ minWidth: 1040 }}>
          <TableHead>
            <TableRow>
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
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <Chip
                    className={methodClasses[entry.method]}
                    color={methodColors[entry.method]}
                    label={entry.method}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <code className={styles.code}>{entry.endpoint}</code>
                </TableCell>
                <TableCell>
                  <Chip
                    color={statusColors[getStatusTone(entry.statusCode)]}
                    label={String(entry.statusCode)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{entry.duration} ms</TableCell>
                <TableCell>{formatBytes(entry.requestSize)}</TableCell>
                <TableCell>{formatBytes(entry.responseSize)}</TableCell>
                <TableCell>{entry.timestamp}</TableCell>
                <TableCell className={entry.errorDetails ? undefined : styles.muted}>
                  {entry.errorDetails ?? '-'}
                </TableCell>
                <TableCell>
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
