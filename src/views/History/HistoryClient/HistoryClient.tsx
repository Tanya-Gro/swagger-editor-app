'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';

import type { RequestHistoryItem } from '../types';

import classNames from 'classnames/bind';
import styles from './HistoryClient.module.css';

const cx = classNames.bind(styles);

const HistoryTable = dynamic(() => import('../HistoryTable/HistoryTable'), {
  ssr: false,
  loading: () => <Paper className={styles.skeleton} variant="outlined" />,
});

type HistoryClientProps = {
  entries: RequestHistoryItem[];
};

export function HistoryClient({ entries }: HistoryClientProps) {
  const t = useTranslations('HISTORY');
  const hasEntries = entries.length > 0;

  return (
    <section aria-labelledby="history-title" className={cx('inner')}>
      <header className={cx('header')}>
        <Box>
          <Typography className={cx('title')} component="h1" id="history-title">
            {t('title')}
          </Typography>
          <Typography className={cx('description')}>{t('description')}</Typography>
        </Box>
      </header>

      {hasEntries ? <HistoryTable entries={entries} /> : null}

      {hasEntries ? null : (
        <section aria-labelledby="empty-title" className={cx('note')}>
          <Typography className={cx('note-title')} component="h2" id="empty-title">
            {t('emptyTitle')}
          </Typography>
          <Typography className={cx('note-text')}>{t('emptyDescription')}</Typography>
          <Stack className={cx('empty-actions')} direction="row">
            <Button component={Link} href="/" variant="contained">
              {t('editorAction')}
            </Button>
          </Stack>
        </section>
      )}
    </section>
  );
}
