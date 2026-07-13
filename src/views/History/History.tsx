import { HistoryClient } from './HistoryClient/HistoryClient';
import type { RequestHistoryItem } from './types';
import styles from './History.module.css';

type HistoryProperties = Readonly<{
  entries: RequestHistoryItem[];
}>;

export function History({ entries }: HistoryProperties) {
  return (
    <div className={styles.page}>
      <HistoryClient entries={entries} />
    </div>
  );
}
