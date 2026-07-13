export type HistoryMethod = string;

export type HistoryStatusTone = 'success' | 'warning' | 'danger';

export type RequestHistoryItem = {
  id: string;
  timestamp: string;
  method: HistoryMethod;
  endpoint: string;
  duration: number;
  statusCode: number | null;
  requestSize: number;
  responseSize: number;
  errorDetails?: string;
};
