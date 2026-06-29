export type HistoryMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HistoryStatusTone = 'success' | 'warning' | 'danger';

export type RequestHistoryItem = {
  id: string;
  timestamp: string;
  method: HistoryMethod;
  endpoint: string;
  duration: number;
  statusCode: number;
  requestSize: number;
  responseSize: number;
  errorDetails?: string;
};
