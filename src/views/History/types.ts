export type HistoryMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type HistoryStatusTone = 'success' | 'warning' | 'danger';

export type HistoryEntry = {
  id: string;
  method: HistoryMethod;
  url: string;
  status: number;
  statusTone: HistoryStatusTone;
  time: string;
  requestSize: string;
  responseSize: string;
  timestamp: string;
  error: string | null;
};
