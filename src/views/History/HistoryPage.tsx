import { getHistoryEntries } from './history-data';
import { HistoryClient } from './HistoryClient';
import styles from './History.module.css';

export function HistoryPage() {
  const entries = getHistoryEntries();

  return (
    <div className={styles.page}>
      <HistoryClient entries={entries} />
    </div>
  );
}
