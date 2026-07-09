import { notFound } from 'next/navigation';
import { getHistoryEntryById } from '@/views/History/history-data';
import { HistoryDetails } from '@/views/History/HistoryDetails';

type HistoryDetailsPageProperties = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export default async function Page({ params }: HistoryDetailsPageProperties) {
  const { id } = await params;
  const entry = getHistoryEntryById(id);

  if (!entry) {
    notFound();
  }

  return <HistoryDetails entry={entry} />;
}
