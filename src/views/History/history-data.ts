import type { HistoryEntry } from './types';

const entries: HistoryEntry[] = [
  {
    id: 'req_001',
    method: 'GET',
    url: '/users?page=1',
    status: 200,
    statusTone: 'success',
    time: '128 ms',
    requestSize: '0.8 KB',
    responseSize: '12.4 KB',
    timestamp: '2026-06-19 14:32',
    error: null,
  },
  {
    id: 'req_002',
    method: 'POST',
    url: '/users',
    status: 201,
    statusTone: 'success',
    time: '246 ms',
    requestSize: '1.2 KB',
    responseSize: '3.8 KB',
    timestamp: '2026-06-19 14:19',
    error: null,
  },
  {
    id: 'req_003',
    method: 'GET',
    url: '/users/999',
    status: 404,
    statusTone: 'warning',
    time: '91 ms',
    requestSize: '0.6 KB',
    responseSize: '0.9 KB',
    timestamp: '2026-06-19 13:58',
    error: 'Not found',
  },
  {
    id: 'req_004',
    method: 'DELETE',
    url: '/users/7',
    status: 500,
    statusTone: 'danger',
    time: '602 ms',
    requestSize: '0.7 KB',
    responseSize: '1.1 KB',
    timestamp: '2026-06-19 13:41',
    error: 'Server error',
  },
  {
    id: 'req_005',
    method: 'PUT',
    url: '/users/3',
    status: 204,
    statusTone: 'success',
    time: '183 ms',
    requestSize: '1.0 KB',
    responseSize: '0 KB',
    timestamp: '2026-06-19 12:12',
    error: null,
  },
];

export function getHistoryEntries(): HistoryEntry[] {
  return entries.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
