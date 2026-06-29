import { getHistoryEntries } from './history-data';
import { HistoryClient } from './HistoryClient';
import styles from './History.module.css';

type HistoryPageProperties = Readonly<{
  entries?: ReturnType<typeof getHistoryEntries>;
}>;

export function HistoryPage({ entries = getHistoryEntries() }: HistoryPageProperties = {}) {
  return (
    <div className={styles.page}>
      <HistoryClient entries={entries} />
    </div>
  );
}
