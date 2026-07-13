import { notFound } from 'next/navigation';
import { HistoryDetails } from '@/views/History/HistoryDetails/HistoryDetails';
import { getHistoryEntryById } from '@/views/History/history-actions';

type HistoryDetailsPageProperties = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function Page({ params }: HistoryDetailsPageProperties) {
  const { id } = await params;
  const entry = await getHistoryEntryById(id);

  if (!entry) {
    notFound();
  }

  return <HistoryDetails entry={entry} />;
}
