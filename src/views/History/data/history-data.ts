import type { RequestHistoryItem } from '../types';

const entries: RequestHistoryItem[] = [
  {
    id: 'update-pet-profile',
    timestamp: '2026-06-19T12:12:00.000Z',
    method: 'PUT',
    endpoint: '/pet/3',
    duration: 183,
    statusCode: 204,
    requestSize: 1024,
    responseSize: 0,
  },
  {
    id: 'get-missing-pet',
    timestamp: '2026-06-19T13:58:00.000Z',
    method: 'GET',
    endpoint: '/pet/999',
    duration: 91,
    statusCode: 404,
    requestSize: 614,
    responseSize: 922,
    errorDetails: 'Pet not found',
  },
  {
    id: 'find-available-pets',
    timestamp: '2026-06-19T14:32:00.000Z',
    method: 'GET',
    endpoint: '/pet/findByStatus?status=available',
    duration: 128,
    statusCode: 200,
    requestSize: 819,
    responseSize: 12_698,
  },
  {
    id: 'delete-pet',
    timestamp: '2026-06-19T13:41:00.000Z',
    method: 'DELETE',
    endpoint: '/pet/7',
    duration: 602,
    statusCode: 500,
    requestSize: 717,
    responseSize: 1126,
    errorDetails: 'Pet service unavailable',
  },
  {
    id: 'place-store-order',
    timestamp: '2026-06-19T14:19:00.000Z',
    method: 'POST',
    endpoint: '/store/order',
    duration: 246,
    statusCode: 201,
    requestSize: 1229,
    responseSize: 3891,
  },
];

export function getHistoryEntries(): RequestHistoryItem[] {
  return entries.toSorted((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export function getHistoryEntryById(id: string): RequestHistoryItem | undefined {
  return getHistoryEntries().find((entry) => entry.id === id);
}
