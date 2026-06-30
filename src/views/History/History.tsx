import { getHistoryEntries } from './history-data';
import { HistoryClient } from './HistoryClient';
import styles from './History.module.css';

type HistoryProperties = Readonly<{
  entries?: ReturnType<typeof getHistoryEntries>;
}>;

export function History({ entries = getHistoryEntries() }: HistoryProperties = {}) {
  return (
    <div className={styles.page}>
      <HistoryClient entries={entries} />
    </div>
  );
}
