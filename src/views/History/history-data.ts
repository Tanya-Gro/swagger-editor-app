import type { RequestHistoryItem } from './types';

const entries: RequestHistoryItem[] = [
  {
    id: 'req_001',
    timestamp: '2026-06-19T14:32:00.000Z',
    method: 'GET',
    endpoint: '/users?page=1',
    duration: 128,
    statusCode: 200,
    requestSize: 819,
    responseSize: 12_698,
  },
  {
    id: 'req_002',
    timestamp: '2026-06-19T14:19:00.000Z',
    method: 'POST',
    endpoint: '/users',
    duration: 246,
    statusCode: 201,
    requestSize: 1229,
    responseSize: 3891,
  },
  {
    id: 'req_003',
    timestamp: '2026-06-19T13:58:00.000Z',
    method: 'GET',
    endpoint: '/users/999',
    duration: 91,
    statusCode: 404,
    requestSize: 614,
    responseSize: 922,
    errorDetails: 'Not found',
  },
  {
    id: 'req_004',
    timestamp: '2026-06-19T13:41:00.000Z',
    method: 'DELETE',
    endpoint: '/users/7',
    duration: 602,
    statusCode: 500,
    requestSize: 717,
    responseSize: 1126,
    errorDetails: 'Server error',
  },
  {
    id: 'req_005',
    timestamp: '2026-06-19T12:12:00.000Z',
    method: 'PUT',
    endpoint: '/users/3',
    duration: 183,
    statusCode: 204,
    requestSize: 1024,
    responseSize: 0,
  },
];

export function getHistoryEntries(): RequestHistoryItem[] {
  return entries.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
