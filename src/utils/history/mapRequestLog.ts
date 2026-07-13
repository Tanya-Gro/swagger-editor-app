import type { Tables } from '@/database/database.types';
import type { RequestHistoryItem } from '../../views/History/types';

type RequestLogRow = Tables<'request_logs'>;

export function mapRequestLogToHistoryItem(log: RequestLogRow): RequestHistoryItem {
  return {
    id: log.id,
    timestamp: log.timestamp,
    method: log.method.toUpperCase(),
    endpoint: log.url,
    duration: log.duration,
    statusCode: log.status,
    requestSize: log.request_size,
    responseSize: log.response_size,
    errorDetails: log.error ?? undefined,
  };
}
