import { serverClient } from '@/database/server-client';
import type { RequestHistoryItem } from '../types';
import { mapRequestLogToHistoryItem } from '@/utils/history/mapRequestLog';

export async function getHistoryEntries(): Promise<RequestHistoryItem[]> {
  const supabase = await serverClient();
  const { data, error } = await supabase.from('request_logs').select('*').order('timestamp', { ascending: false });

  if (error) {
    throw new Error(`Failed to load request history: ${error.message}`);
  }

  return data.map((log) => mapRequestLogToHistoryItem(log));
}

export async function getHistoryEntryById(id: string): Promise<RequestHistoryItem | undefined> {
  const supabase = await serverClient();
  const { data, error } = await supabase.from('request_logs').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw new Error(`Failed to load request history item: ${error.message}`);
  }

  return data ? mapRequestLogToHistoryItem(data) : undefined;
}
