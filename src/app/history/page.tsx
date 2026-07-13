import { History } from '@/views/History/History';
import { getHistoryEntries } from '@/views/History/history-actions';

export default async function Page() {
  const entries = await getHistoryEntries();

  return <History entries={entries} />;
}
