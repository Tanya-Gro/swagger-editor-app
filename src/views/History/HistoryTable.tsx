'use client';

import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { HistoryEntry, HistoryMethod, HistoryStatusTone } from './types';
import styles from './History.module.css';

const methodColors: Record<HistoryMethod, 'primary' | 'error'> = {
  GET: 'primary',
  POST: 'primary',
  PUT: 'primary',
  DELETE: 'error',
};

const statusColors: Record<HistoryStatusTone, 'success' | 'warning' | 'error'> = {
  success: 'success',
  warning: 'warning',
  danger: 'error',
};

type HistoryTableProps = {
  entries: HistoryEntry[];
};

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
                  <Chip color={methodColors[entry.method]} label={entry.method} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <code className={styles.code}>{entry.url}</code>
                </TableCell>
                <TableCell>
                  <Chip color={statusColors[entry.statusTone]} label={entry.status} size="small" />
                </TableCell>
                <TableCell>{entry.time}</TableCell>
                <TableCell>{entry.requestSize}</TableCell>
                <TableCell>{entry.responseSize}</TableCell>
                <TableCell>{entry.timestamp}</TableCell>
                <TableCell className={entry.error ? undefined : styles.muted}>{entry.error ?? '-'}</TableCell>
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
