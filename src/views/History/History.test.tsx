import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { mapRequestLogToHistoryItem } from '@/utils/history/mapRequestLog';
import { History } from './History';
import { HistoryClient } from './HistoryClient/HistoryClient';
import HistoryTable from './HistoryTable/HistoryTable';
import messages from '@messages/en.json';
import type { Tables } from '@/database/database.types';
import type { RequestHistoryItem } from './types';

const mockEntries: RequestHistoryItem[] = [
  {
    id: 'find-pets-test',
    timestamp: '2026-06-19T15:00:00.000Z',
    method: 'GET',
    endpoint: '/pet/findByStatus?status=available',
    duration: 120,
    statusCode: 200,
    requestSize: 512,
    responseSize: 2048,
  },
  {
    id: 'missing-pet-test',
    timestamp: '2026-06-19T14:00:00.000Z',
    method: 'POST',
    endpoint: '/pet/unknown',
    duration: 350,
    statusCode: 404,
    requestSize: 1024,
    responseSize: 256,
    errorDetails: 'Pet not found',
  },
];

function formatExpectedTimestamp(timestamp: string): string {
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function renderHistory(entries = mockEntries): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <History entries={entries} />
    </NextIntlClientProvider>,
  );
}

function renderHistoryClient(entries: RequestHistoryItem[]): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <HistoryClient entries={entries} />
    </NextIntlClientProvider>,
  );
}

function renderHistoryTable(entries: RequestHistoryItem[]): void {
  render(
    <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
      <HistoryTable entries={entries} />
    </NextIntlClientProvider>,
  );
}

describe('History', () => {
  it('maps request log rows to history items', () => {
    const historyItem = mapRequestLogToHistoryItem({
      id: 'request-log-id',
      timestamp: '2026-06-19T15:00:00.000Z',
      method: 'get',
      url: '/pet/findByStatus?status=available',
      duration: 120,
      status: 200,
      request_size: 512,
      response_size: 2048,
      error: null,
      owner_id: 'user-id',
      schema_id: 'schema-id',
    } satisfies Tables<'request_logs'>);

    expect(historyItem).toEqual({
      id: 'request-log-id',
      timestamp: '2026-06-19T15:00:00.000Z',
      method: 'GET',
      endpoint: '/pet/findByStatus?status=available',
      duration: 120,
      statusCode: 200,
      requestSize: 512,
      responseSize: 2048,
      errorDetails: undefined,
    });
  });

  it('renders for an authorized user', () => {
    renderHistory();

    expect(screen.getByRole('heading', { name: 'Request history' })).toBeInTheDocument();
  });

  it('renders a table with history data', () => {
    renderHistoryTable(mockEntries);

    const table = screen.getByRole('table');

    expect(within(table).getByText('/pet/findByStatus?status=available')).toBeInTheDocument();
    expect(within(table).getByText('/pet/unknown')).toBeInTheDocument();
    expect(within(table).getByText('120 ms')).toBeInTheDocument();
    expect(within(table).getByText('2.0 KB')).toBeInTheDocument();
    expect(within(table).getByText(formatExpectedTimestamp(mockEntries[0].timestamp))).toBeInTheDocument();
    expect(within(table).queryByText('2026-06-19T15:00:00.000Z')).not.toBeInTheDocument();
    expect(within(table).getByText('Pet not found')).toBeInTheDocument();
    expect(within(table).getAllByRole('link', { name: 'Details' })[0]).toHaveAttribute(
      'href',
      '/history/find-pets-test',
    );
  });

  it('renders an empty state with an editor link when history is empty', () => {
    renderHistoryClient([]);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Empty history' })).toBeInTheDocument();
    expect(screen.getByText(/You haven't executed any requests yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Editor' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: 'Viewer' })).not.toBeInTheDocument();
  });
});
