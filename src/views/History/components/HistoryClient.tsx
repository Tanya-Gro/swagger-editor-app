'use client';

import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { RequestHistoryItem } from '../types';
import styles from '../History.module.css';

const HistoryTable = dynamic(() => import('./HistoryTable'), {
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
    <section aria-labelledby="history-title" className={styles.inner}>
      <header className={styles.header}>
        <Box>
          <Typography className={styles.title} component="h1" id="history-title">
            {t('title')}
          </Typography>
          <Typography className={styles.description}>{t('description')}</Typography>
        </Box>
      </header>

      {hasEntries ? <HistoryTable entries={entries} /> : null}

      {hasEntries ? null : (
        <section aria-labelledby="empty-title" className={styles.note}>
          <Typography className={styles['note-title']} component="h2" id="empty-title">
            {t('emptyTitle')}
          </Typography>
          <Typography className={styles['note-text']}>{t('emptyDescription')}</Typography>
          <Stack className={styles['empty-actions']} direction="row">
            <Button component={Link} href="/" variant="contained">
              {t('editorAction')}
            </Button>
          </Stack>
        </section>
      )}
    </section>
  );
}
