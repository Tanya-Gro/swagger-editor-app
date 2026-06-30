import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import messages from '@messages/en.json';
import { History } from './History';
import { HistoryClient } from './HistoryClient';
import HistoryTable from './HistoryTable';
import type { RequestHistoryItem } from './types';

const mockEntries: RequestHistoryItem[] = [
  {
    id: 'req_test_001',
    timestamp: '2026-06-19T15:00:00.000Z',
    method: 'GET',
    endpoint: '/pets',
    duration: 120,
    statusCode: 200,
    requestSize: 512,
    responseSize: 2048,
  },
  {
    id: 'req_test_002',
    timestamp: '2026-06-19T14:00:00.000Z',
    method: 'POST',
    endpoint: '/pets/unknown',
    duration: 350,
    statusCode: 404,
    requestSize: 1024,
    responseSize: 256,
    errorDetails: 'Pet not found',
  },
];

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
  it('renders for an authorized user', () => {
    renderHistory();

    expect(screen.getByRole('heading', { name: 'Request history' })).toBeInTheDocument();
  });

  it('renders a table with history data', () => {
    renderHistoryTable(mockEntries);

    const table = screen.getByRole('table');

    expect(within(table).getByText('/pets')).toBeInTheDocument();
    expect(within(table).getByText('/pets/unknown')).toBeInTheDocument();
    expect(within(table).getByText('120 ms')).toBeInTheDocument();
    expect(within(table).getByText('2.0 KB')).toBeInTheDocument();
    expect(within(table).getByText('Pet not found')).toBeInTheDocument();
    expect(within(table).getAllByRole('link', { name: 'Details' })[0]).toHaveAttribute('href', '/history/req_test_001');
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
