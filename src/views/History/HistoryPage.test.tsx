import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import messages from '@messages/ru.json';
import { HistoryPage } from './HistoryPage';

vi.mock('next/dynamic', () => ({
  default: () => {
    function DynamicHistoryTable() {
      return <section aria-label="Список истории запросов" />;
    }

    return DynamicHistoryTable;
  },
}));

function renderAuthorizedHistoryPage(): void {
  render(
    <NextIntlClientProvider locale="ru" messages={messages} timeZone="UTC">
      <HistoryPage />
    </NextIntlClientProvider>,
  );
}

describe('HistoryPage', () => {
  it('renders for an authorized user', () => {
    renderAuthorizedHistoryPage();

    expect(screen.getByRole('heading', { name: 'История запросов' })).toBeInTheDocument();
    expect(screen.getByLabelText('Список истории запросов')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Пустая история' })).toBeInTheDocument();
  });
});
