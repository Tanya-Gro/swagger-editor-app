import { HistoryClient } from './components/HistoryClient';
import { getHistoryEntries } from './data/history-data';
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
